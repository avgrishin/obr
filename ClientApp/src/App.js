import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import { Home } from './components/Home';
import { CourseBox } from './components/CourseBox';
import { RateBox } from './components/RateBox';
import { PifBox } from './components/PifBox';
import { Pifer } from './components/Pifer';
import { Counter } from './components/Counter';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/course' component={ CourseBox } />
    <Route path='/rate' component={ RateBox } />
    <Route path='/pif' component={ PifBox } />
    <Route path='/pifer' component={ Pifer } />
    <Route path='/counter' component={ Counter } />
  </Layout>
);
