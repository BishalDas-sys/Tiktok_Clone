import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";
import VideoPost from "./pages/VideoPost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function AuthApp() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Feed />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/:username/video/:postId">
          <VideoPost />
        </Route>
        <Route exact path="/:username">
          <Profile />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
