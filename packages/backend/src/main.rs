#![allow(non_camel_case_types)]

use std::collections::HashMap;
use std::convert::Infallible;
use std::env;
use std::sync::Arc;

use juniper::{EmptySubscription, ExecutionError, FieldError, FieldResult, graphql_object, GraphQLEnum, GraphQLObject, RootNode};
use juniper::http::graphiql::graphiql_source;
use juniper::http::GraphQLRequest;
use log::{debug, error, info};
use serde::Serialize;
use serde_json::Value;
use warp::Filter;

const DATABASE_ERROR: &str = "A database error occurred, please try again later.";

//region GraphQL
#[derive(GraphQLObject)]
struct Guild {
    can_edit: bool,
    settings: Option<GuildSettings>,
    channels: Vec<Channel>,
    roles: Vec<Role>,
}

#[graphql_object(context = Context)]
impl Guild {
    fn can_edit(&self) -> bool {
        return true; // TODO: properly permissions
    }

    fn settings(&self, ctx: &Context) -> FieldResult<Option<GuildSettings>> {
        // TODO: figure out how to get guild id in here
        // TODO: serialize result
        let id = "";
        match ctx.client.query_one("SELECT * FROM GuildSettings WHERE id = $1", &[&id]).await {
            Ok(row) => {
                if row.is_empty() { return Ok(None); } else { return Ok(None); }
            }
            Err(e) => {
                error!(e);
                return Err(DATABASE_ERROR)?;
            }
        }
    }
}

#[derive(GraphQLObject)]
struct GuildSettings {
    join_message: Option<String>,
    log_channel: Option<String>,
    report_channel: Option<String>,
    auto_roles: Vec<String>,
}

#[derive(GraphQLObject)]
struct Role {
    id: String,
    name: String,
    perms: i32,
    pos: i32,
    color: String,
}

#[derive(GraphQLEnum)]
enum OverwriteType {
    member,
    role,
}

#[derive(GraphQLObject)]
struct PermissionOverwrite {
    id: String,
    #[graphql(name = "type")]
    type_: OverwriteType,
    allow: i32,
    deny: i32,
}

#[derive(GraphQLEnum)]
enum ChannelType {
    dm,
    text,
    voice,
    category,
    news,
    store,
    unknown,
}

#[derive(GraphQLObject)]
struct Channel {
    id: String,
    name: String,
    #[graphql(name = "type")]
    type_: ChannelType,
    perms: Vec<PermissionOverwrite>,
}

#[derive(GraphQLObject)]
struct User {
    id: String,
    username: String,
    discriminator: String,
    avatar: Option<String>,
    locale: Option<String>,
}

#[derive(GraphQLObject)]
struct Status {
    uptime: i32,
    cpu: i32,
    memory: i32,
}
//endregion

struct Context {
    client: tokio_postgres::Client,
    client_id: String,
    client_secret: String,
}

impl juniper::Context for Context {}

struct QueryRoot;

#[graphql_object(Context = Context)]
impl QueryRoot {
    async fn status() -> FieldResult<Status> {
        Ok(Status {
            uptime: 420,
            cpu: 100,
            memory: 69420,
        })
    }
}

struct MutationRoot;

#[graphql_object(Context = Context)]
impl MutationRoot {
    async fn token(ctx: &Context, oauth_code: String) -> FieldResult<User> {
        #[derive(Serialize)]
        struct TokenRequest {
            client_id: String,
            client_secret: String,
            grant_type: String,
            code: String,
            redirect_uri: String,
            scope: String,
        }
        let body = TokenRequest {
            client_id: ctx.client_id.to_owned(),
            client_secret: ctx.client_secret.to_owned(),
            grant_type: "authorization_code".to_owned(),
            code: oauth_code,
            redirect_uri: "http://localhost:3000/KitCat".to_owned(),
            scope: "identify guilds".to_owned(),
        };
        let body = serde_urlencoded::to_string(&body).expect("failed to serialize oauth request");
        println!("{:?}", body);
        let response = reqwest::Client::new()
            .post("https://discord.com/api/v8/oauth2/token")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(body)
            .send().await?
            .text().await;

        let _json = match response {
            Ok(str) => {
                let data: HashMap<String, serde_json::Value> = match serde_json::from_str(&str) {
                    Ok(data) => data,
                    Err(e) => return Err(FieldError::from(e))
                };
                data
            }
            Err(e) => return Err(FieldError::from(e))
        };

        for (key, value) in &_json {
            println!("{}: {}", key, value);
        }

        return Err(FieldError::from("not implemented yet"));

        return Ok(User {
            id: _json.get("id").unwrap().to_string(),
            username: _json.get("username").unwrap().to_string(),
            discriminator: _json.get("discriminator").unwrap().to_string(),
            avatar: match _json.get("avatar") {
                None => None,
                Some(val) => match val {
                    Value::Null => None,
                    Value::String(str) => Option::from(str.to_owned()),
                    _ => panic!("discord oauth current user's avatar is not a supported type")
                }
            },
            locale: match _json.get("locale") {
                None => None,
                Some(val) => match val {
                    Value::Null => None,
                    Value::String(str) => Option::from(str.to_owned()),
                    _ => panic!("discord oauth current user's locale is not a supported type")
                }
            },
        });
    }
}

type Schema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<Context>>;

#[tokio::main]
async fn main() {
    let client_id = env::var("DISCORD_CLIENT_ID").expect("client id missing in environment variables");
    let client_secret = env::var("DISCORD_CLIENT_SECRET").expect("client secret missing in environment variables");

    let (client, connection) = tokio_postgres::connect("host=localhost port=5432 user=kitcat password=admin dbname=kitcat", tokio_postgres::NoTls)
        .await
        .unwrap();
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let schema = Arc::new(Schema::new(QueryRoot, MutationRoot, EmptySubscription::new()));
    let schema = warp::any().map(move || Arc::clone(&schema));

    let ctx = Arc::new(Context { client, client_id, client_secret });
    let ctx = warp::any().map(move || Arc::clone(&ctx));

    async fn handle_graphql_request(schema: Arc<Schema>, ctx: Arc<Context>, req: GraphQLRequest) -> Result<impl warp::Reply, Infallible> {
        let res = req.execute(&schema, &ctx).await;
        let json = serde_json::to_string(&res).unwrap();
        Ok(json)
    }

    let graphql_route = warp::post()
        .and(warp::path!("graphql"))
        .and(schema.clone())
        .and(ctx.clone())
        .and(warp::body::json())
        .and_then(handle_graphql_request);

    let graphiql_route = warp::get()
        .and(warp::path!("graphiql"))
        .map(|| warp::reply::html(graphiql_source("graphql", None)));

    let routes = graphql_route.or(graphiql_route);

    warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
}
