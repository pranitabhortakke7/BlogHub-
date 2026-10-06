import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

import Card from "../../components/UI/Card/Card";
import Button from "../../components/UI/Button/Button";
import { followUser, unfollowUser } from "../../redux/auth/actions";

import "./UserPage.css";

const UserPage = props => {
  const { username } = props.match.params;
  const { isAuth, localUser, onFollowUser, onUnfollowUser } = props;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get(`/api/users/${username}`);
        setUser(res.data.user);
        setFollowing(
          isAuth &&
            res.data.user.followers.some(
              follower => String(follower) === String(localUser.id)
            )
        );
      } catch (err) {
        props.history.push("/404");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [username, isAuth, localUser.id, props.history]);

  const toggleFollow = async () => {
    try {
      const action = following ? onUnfollowUser : onFollowUser;
      const res = await action(user._id);
      setUser(res.data.user);
      setFollowing(!following);
    } catch (err) {
      console.log(err.response);
    }
  };

  if (loading || !user) {
    return <Card>Loading profile...</Card>;
  }

  return (
    <div className="user-page">
      <Card>
        <div className="user-page__header">
          <img src={user.avatar} alt={user.username} />
          <div>
            <h2>{user.fullname}</h2>
            <p>@{user.username}</p>
          </div>
          {isAuth && String(localUser.id) !== String(user._id) ? (
            <Button btnClass={following ? "danger" : "success"} onClick={toggleFollow}>
              {following ? "Unfollow" : "Follow"}
            </Button>
          ) : null}
        </div>
        <div className="user-page__counts">
          <span><strong>{user.followers.length}</strong> Followers</span>
          <span><strong>{user.following.length}</strong> Following</span>
        </div>
        {user.status ? <p className="user-status">{user.status}</p> : null}
        {user.about ? <p>{user.about}</p> : null}
      </Card>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  localUser: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  onFollowUser: userId => dispatch(followUser(userId)),
  onUnfollowUser: userId => dispatch(unfollowUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserPage));
