import React from 'react';
import Cookies from 'universal-cookie';

export function ReactIsInDevelomentMode() {
  return '_self' in React.createElement('div') && new Cookies().get('env') === 'development';
}
