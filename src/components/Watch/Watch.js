/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  MoreHoriz,
  PlaylistAdd,
  Reply,
  ThumbDownAlt,
  ThumbUpAlt,
} from "@material-ui/icons";
import firebase from 'firebase/compat/app';
import { Avatar, Button } from "@material-ui/core";
import { VideoSmall } from "..";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { useAppContext } from "../../context/appContext";
import { db } from "../../lib/firebase";

const Watch = ({ video }) => {
  const history = useHistory();
  const handleAvatarRedirect = () => history.push(`/PreviewChannel?name=${video.email}`);
  const [showDesc, setShowDesc] = useState(false);

  const { videos, currentUser } = useAppContext();

  const formattedDate = moment
    .unix(video?.timestamp?.seconds)
    .format("MMM DD, YYYY  ");

  const Subscribe = () => {
    db.collection("users").doc(video.email).update({ subscribers: firebase.firestore.FieldValue.arrayUnion(currentUser.email) })

    db.collection("users").doc(currentUser.email).update({ subscription: firebase.firestore.FieldValue.arrayUnion(video.email) })
  }
  const Unsubscribe = () => {
    db.collection("users").doc(video.email).update({ subscribers: firebase.firestore.FieldValue.arrayRemove(currentUser.email) })

    db.collection("users").doc(currentUser.email).update({ subscription: firebase.firestore.FieldValue.arrayRemove(video.email) })
  }

  const [channelData, setChannelData] = useState({});

  useEffect(() => {
    db.collection("users").doc(video.email).onSnapshot((snapshot) => {
      setChannelData(snapshot.data())
    })
  }, [video])

  const like = () => {

    if (video?.like?.includes(currentUser.email)) {
      db.collection("Videos")
        .doc(video.id)
        .update({ likes: firebase.firestore.FieldValue.arrayRemove(currentUser.email), });
      return;
    }

    db.collection("Videos")
      .doc(video.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUser.email),
        dislikes: firebase.firestore.FieldValue.arrayRemove(currentUser.email),
      });
    return;

  };

  const dislike = () => {

    if (video?.dislikes?.includes(currentUser.email)) {
      db.collection("Videos")
        .doc(video.id)
        .update({ dislikes: firebase.firestore.FieldValue.arrayRemove(currentUser.email), });
      return;
    }

    db.collection("Videos")
      .doc(video.id)
      .update({
        dislikes: firebase.firestore.FieldValue.arrayUnion(currentUser.email),
        likes: firebase.firestore.FieldValue.arrayRemove(currentUser.email),
      });
    return;

  };

  useEffect(() => {
    db.collection("Videos").doc(video.id).update({ views: firebase.firestore.FieldValue.arrayUnion(currentUser.email) })
  }, [currentUser.email, video.id])


  return (
    <div className="watch">
      <div className="watch__wrap">
        <div className="watch__left">
          <video className="watch__video" autoPlay controls>
            <source src={video.videoURL} type="video/mp4" />
          </video>

          <div className="watch__leftBtm">
            <h1 className="watch__title">{video.title}</h1>

            <div className="watch__videoInfo">
              <div className="watch__videoInfoLeft">
                <p className="videothumb__text">{video?.views?.length ? video?.views?.length : "0"} views • {formattedDate}</p>
              </div>

              <div className="watch__videoInfoRight">
                <div className="watch__likeContainer">
                  <div className="watch__likeWrap">
                    <div className="watch__likeBtnContainer color--gray" onClick={like}>
                      <ThumbUpAlt className="watch__icon" color={video?.likes?.includes(currentUser.email) ? "primary" : "default"} />
                      <p>{video?.likes?.length}</p>
                    </div>

                    <div className="watch__likeBtnContainer color--gray" onClick={dislike}>
                      <ThumbDownAlt className="watch__icon" color={video?.dislikes?.includes(currentUser.email) ? "primary" : "default"} />
                      <p>{video?.dislikes?.length}</p>
                    </div>
                  </div>

                  <div className="Hello" style={{ position: "relative", marginTop: "10px" }}>

                    <div
                      style={{ backgroundColor: "#606060", width: "100%", height: "3px", position: "absolute" }}
                    >
                    </div>
                    <div style={{ backgroundColor: "#818181", width: `${(video?.likes?.length / (video?.likes?.length + video?.dislikes?.length)) * 100}%`, height: "3px", position: "absolute" }}></div>

                  </div>
                </div>

                <div className="watch__likeBtnContainer color--gray">
                  <Reply className="watch__icon share-icon" />
                  <p>SHARE</p>
                </div>

                <div className="watch__likeBtnContainer color--gray">
                  <PlaylistAdd className="watch__icon play-addIcon" />
                  <p>SAVE</p>
                </div>

                <div className="watch__likeBtnContainer color--gray">
                  <MoreHoriz className="watch__icon play-addIcon" />
                  <p>SAVE</p>
                </div>
              </div>
            </div>
          </div>

          <div className="watch__details">
            <div className="watch__detailsContainer">
              <div className="videothumb__details watch__avatarWrap">
                <Avatar
                  style={{ cursor: "pointer" }}
                  onClick={handleAvatarRedirect}
                />

                <div className="videothumb__channel">
                  <h1 className="videothumb__title">{video.channelName}</h1>

                  <p className="videothumb__text watch__subCount">
                    {channelData?.subscribers?.length}{" "}{channelData?.subscribers?.length <= 1 ? "Subscriber" : "Subscribers"}
                  </p>
                </div>
              </div>
              {channelData?.subscribers?.includes(currentUser.email) ? (
                <Button color="default" variant="contained" onClick={Unsubscribe}>SUBSCRIBED</Button>
              ) : (
                <Button
                  className={`${currentUser.email === video.email ? "watch__subBtn-disabled" : "watch__subBtn"}`}
                  color="primary"
                  variant="contained"
                  disabled={currentUser.email === video.email}
                  onClick={Subscribe}
                >
                  SUBSCRIBE
                </Button>
              )}

            </div>

            <div className="watch__description">
              <p style={{ maxHeight: showDesc && "100%" }}>
                {video.description}
              </p>
              <p
                className="watch__showMore"
                onClick={() => setShowDesc(!showDesc)}
              >
                SHOW {showDesc ? "LESS" : "MORE"}
              </p>
            </div>
          </div>
        </div>
        <div className="watch__right">
          {videos.map((item) => (
            <VideoSmall key={item.id} video={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;