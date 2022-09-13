import React from 'react';
import moment from 'moment'
import { Avatar } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './styles.css';

const VideoThumb = ({video}) => {

    const history = useHistory()

    const handleThumbnailClick = () => {history.push(`/watch/${video.id}`)}
    const handleAvatarClick = () => history.push(`/PreviewChannel?name=${video.email}`)

    const fromattedDate = moment.unix(video?.timestamp?.seconds).format("YYYY MM DD, HH:mm:ss")

    const uploadingTime = moment(fromattedDate, "YYYY MM DD, HH:mm:ss").fromNow()

    return (
        <>
            <div className="videothumb">

                <img src={video.thumbnailURL} alt="YouTube" className="videothumb__thumbnail" onClick={handleThumbnailClick}/>

                <div className="videothumb__details">
                   <Avatar onClick={handleAvatarClick}/>

                    <div className="videothumb__channel">
                        <h1 className="videothumb__title">
                            {video.title}
                        </h1>

                        <div className="videothumb__texts">
                            <p className="videothumb__text">
                                {video.channelName}
                            </p>
                            <p className="videothumb__text">
                                {video?.views?.length ? video.views.length : "0"} views • {uploadingTime}
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
};

export default VideoThumb;
