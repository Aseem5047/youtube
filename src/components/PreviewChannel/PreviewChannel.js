import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { VideoSmall } from "..";
import "./styles.css";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import { db } from "../../lib/firebase";
import firebase from 'firebase/compat/app';

const PreviewChannel = () => {
    const location = useLocation();

    const channel = new URLSearchParams(location.search).get("name");

    const [currentChannel, setCurrentChannel] = useState([]);
    const { videos, currentUser } = useAppContext();

    useEffect(() => {
        setCurrentChannel(videos.filter((video) => video.email === channel));
    }, [channel, videos]);

    const Unsubscribe = () => {
        db.collection("users").doc(channel).update({ subscribers: firebase.firestore.FieldValue.arrayRemove(currentUser.email) })

        db.collection("users").doc(currentUser.email).update({ subscription: firebase.firestore.FieldValue.arrayRemove(channel) })
    }

    const Subscribe = () => {
        db.collection("users").doc(currentUser.email).update({ subscribers: firebase.firestore.FieldValue.arrayUnion(currentUser.email) })

        db.collection("users").doc(currentUser.email).update({ subscription: firebase.firestore.FieldValue.arrayUnion(channel) })
    }

    const [channelData, setChannelData] = useState({});

    useEffect(() => {
        db.collection("users").doc(channel).onSnapshot((snapshot) => {
            setChannelData(snapshot.data())
        })
    }, [channel])

    // const [thumbnail, setThumbnail] = useState({});
    // console.log(videos);

    return (
        <div className="channel">
            <img className="channel__art" src="https://images-eu.ssl-images-amazon.com/images/G/31/img20/Smallappliances/Jupiter-21/Slot_16_Curated-store_Banner_PC.gif" alt="Channel Art" />

            <div className="channel__details">
                <div className="channel__detailsWrap">
                    <div className="channel__avatarWrap">
                        <Avatar className="channel__avatar" />

                        <div className="videothumb__channel">
                            <h1 className="channel__title">{channelData.firstName} {channelData.lastName}</h1>

                            <p className="videothumb__text watch__subCount">
                                {channelData?.subscribers?.length}{" "}{channelData?.subscribers?.length > 1 ? "Subscribers" : "0 Subscriber"}
                            </p>
                        </div>
                    </div>
                    {channelData?.subscribers?.includes(currentUser.email) ? (
                        <Button color="default" variant="contained" onClick={Unsubscribe}>SUBSCRIBED</Button>
                    ) : (
                        <Button
                            className={`${currentUser.email === channel ? "watch__subBtn-disabled" : "watch__subBtn"}`}
                            color="primary"
                            variant="contained"
                            disabled={currentUser.email === channel}
                            onClick={Subscribe}
                        >
                            SUBSCRIBE
                        </Button>
                    )}
                </div>
                <div className="channel__links">
                    <div className="channel__link">
                        <p>HOME</p>
                    </div>
                    <div className="channel__link channel__link--active">
                        <p>VIDEOS</p>
                        <div className="channel__link__border"></div>
                    </div>
                    <div className="channel__link">
                        <p>COMMUNITY</p>
                    </div>
                    <div className="channel__link">
                        <p>PLAYLISTS</p>
                    </div>
                    <div className="channel__link">
                        <p>CHANNELS</p>
                    </div>
                    <div className="channel__link">
                        <p>ABOUT</p>
                    </div>
                </div>
            </div>
            <div className="channel__content">
                <div className="channel__contentWrapper">
                    {currentChannel.map((video) => (
                        <VideoSmall video={video} key={video.id} channelView />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PreviewChannel;