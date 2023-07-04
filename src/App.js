import React, { useEffect } from 'react';
import { Navbar } from './components/NavBar';
import {
  Counter,
  TextInputWithFocusButton,
  IntervalCounter,
} from './pages/Hook/HookTest';
// import { Fancy } from './pages/ForwardRef/ForwardRef'
// import { Counter } from './features/counter/Counter'
import { AddPostForm } from './features/posts/AddPostForm';
import { PostsList } from './features/posts/PostsList';
import { SinglePostPage } from './features/posts/SinglePostPage';
import { EditPostForm } from './features/posts/EditPostForm';
import { UsersList } from './features/users/UsersList';
import { UserPage } from './features/users/UserPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './App.css';
import './pages/Hook/UseSelector';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Navbar />
        <div className="App">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <React.Fragment>
                  {/* <AddPostForm />
                  <PostsList /> 
                  <TextInputWithFocusButton />
                  <Counter initialCount={1} />*/}
                  <IntervalCounter />
                </React.Fragment>
              )}
            />
            <Route exact path="/posts/:postId" component={SinglePostPage} />
            <Route exact path="/editPost/:postId" component={EditPostForm} />
            <Route exact path="/users" component={UsersList} />
            <Route exact path="/users/:userId" component={UserPage} />
            {/* <Route exact path="/live" component={HttpFlv} /> */}
            {/* <Route exact path="/notifications" component={NotificationsList} /> */}
            <Redirect to="/" />
          </Switch>
          {/* <TextInputWithFocusButton />
        <Fancy></Fancy> */}
        </div>
      </Router>
    );
  }
}

export default App;
