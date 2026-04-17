import axios from "axios";
import { useEffect, useState } from "react";

const URL_FORUMS = "http://127.0.0.1:8000/api/forums/";
const URL_FORUM_DISCUSSION = "http://127.0.0.1:8000/api/forum_discussions/";
const URL_FORUM = "http://localhost:8000/api/forum/";
const URL_DISCUSSIONS = "http://localhost:8000/api/discussions/";
const URL_DISCUSSION_COMMENTS = "http://localhost:8000/api/discussion_comments/";

export const useForums = () => {
    const [forums, setForums] = useState([]);

    const getForums = () => {
        axios.get(URL_FORUMS)
            .then((response) => {
                setForums(response.data);
            })
            .catch((error) => {
                console.error('Error fetching forums:', error);
            });
    };

    // Optional: Auto-fetch on mount
    useEffect(() => {
        getForums();
    }, []);

    return { forums, getForums };
};

export const useForumDiscussions = (forum) => {
    const [forumDiscussions, SetForumDiscussions] = useState([]);

    const getForumDiscussions = (() => {
        axios.get(URL_FORUM_DISCUSSION + forum)
            .then((request) => { SetForumDiscussions(request.data) });
    });

    useEffect(() => {
        getForumDiscussions()
    }, []);

    return { forumDiscussions, getForumDiscussions };
};

export const useForum = (forum_id) => {
    const [forum, setForum] = useState([]);

    const getForum = () => {
        axios.get(URL_FORUM + forum_id)
            .then((request) => setForum(request.data))
    };

    useEffect(() => {
        getForum();
    }, []);

    return { forum, getForum };
}

export const useDiscussions = () => {
    const [discussions, SetDiscussions] = useState([]);

    const getDiscussions = (() => {
        axios.get(URL_DISCUSSIONS)
            .then((request) => {
                SetDiscussions(request.data)
            });
    });

    useEffect(() => {
        getDiscussions()
    }, []);

    return { discussions, getDiscussions };
}

export const useDiscussionComments = (discussion_id) => {
    const [comments, setCommentList] = useState([]);

    const getComments = () => {
        axios.get(URL_DISCUSSION_COMMENTS + discussion_id)
            .then((request) => {
                setCommentList(request.data);
            })
    };

    useEffect(() => {
        getComments();
    }, [])

    return {comments, getComments};
}
