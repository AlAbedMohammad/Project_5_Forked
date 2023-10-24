import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./EmployeeDetiles.css";
import {
    setComment,
    deletecomment,
    addNewComment,
} from "../../../service/redux/reducers/employeeSlice";
import { useParams } from "react-router-dom";
import { Avatar, Typography, Button } from "@material-tailwind/react";
import { MapPinIcon, BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//!=================================== show details employee ... ====================================================
const EmployeeDetails = () => {
    const navigate = useNavigate();
    const [comment, setcomment] = useState("");
    const [massege, setMassege] = useState("");
    const [employee, setEmployee] = useState({});
    const [show, setShow] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const employeeId = useParams();

    const { userId } = useSelector((state) => state.auth);
    const { comments } = useSelector((state) => state.employee);
    const { tokenUser } = useSelector((state) => state.auth);
    const [message, setMessage] = useState("");

    //!======================================================================

    useEffect(() => {
        allCommentsUser();
        getEmployeeDetails();
    }, []);

    //! ======================================== show comments =================================================

    const allCommentsUser = async () => {
        try {
            const results = await axios.get(
                `https://geeks-app.onrender.com/employees/allcomment/${id}`
            );

            if (results) {
                dispatch(setComment(results.data.result));
            }
        } catch (error) {
            if (error.response.data.success) {
                setMassege(error.response.data.massege);
            }
        }
    };

    //! ======================================== add comment ====================================================

    const addFeadBackFromUser = async () => {
        const commentss = {
            employee_id: id,
            user_id: userId,
            comment,
        };
        try {
            const results = await axios.post(
                "https://geeks-app.onrender.com/employees/feadback/user",
                commentss,
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                }
            );
            if (results.data.success) {
                dispatch(addNewComment(results.data.result[0]));
            }
        } catch (error) {
            console.log(error);
            if (error) {
                setMassege(error.response);
            }
        }
    };

    //! ======================================== delete comment ====================================================

    const DeleteCommentUser = async (id) => {
        try {
            const result = await axios.delete(
                `https://geeks-app.onrender.com/employees/comment/${id}`
            );
            dispatch(deletecomment(id));
        } catch (error) {
            if (error.response.data.success) {
                setMassege(error.response.data.massege);
            }
        }
    };

    //!======================================================================

    const getEmployeeDetails = async () => {
        try {
            const result = await axios.get(
                `https://geeks-app.onrender.com/employees/${id}`
            );
            if (result.data) {
                setEmployee(result.data.result);
            } else {
                setMassege("NOt found details");
            }
        } catch (error) {
            if (error.response.data.success) {
                setMassege(error.response.data.massege);
            }
        }
    };

    //!========================================================================

    const newConversation = async () => {
        try {
            const result = await axios.post(
                `https://geeks-app.onrender.com/conversation`,
                { receiverId: parseInt(id) },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                }
            );
            if (result.data) {
                navigate("/chat");
            } else {
                setMassege("NOt found details");
            }
        } catch (error) {
            if (error.response.data.success) {
            }
        }
    };

    const handleHire = async () => {
        try {
            const result = await axios.post(
                `https://geeks-app.onrender.com/users/hire/${employeeId.id}`,
                { note: "Hello employee" },
                {
                    headers: { Authorization: `Bearer ${tokenUser}` },
                }
            );
            if (result.data.success) {
                toast.success("Employee Hired")
            } else if(result.data.message === "The token is invalid or expired") {
                toast.error("Login First");
            }else {
                toast.warning("Employee Already Hired");
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <>
            <div>
                <ToastContainer />
            </div>
            <section className="relative block h-[50vh]">
                <div className="bg-profile-background absolute top-0 h-full w-full  bg-cover bg-center" />
                <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center" />
            </section>
            <section className="relative bg-blue-gray-50/50 py-16 px-4">
                <div className="container mx-auto">
                    <div className="relative mb-6 -mt-64 flex w-full min-w-0 flex-col break-words rounded-3xl bg-white shadow-xl shadow-gray-500/5">
                        <div className="px-6">
                            <div className="flex flex-wrap justify-center">
                                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                                    <div className="relative">
                                        <div className="-mt-20 w-70">
                                            <Avatar
                                                src={employee?.img}
                                                alt="Profile picture"
                                                variant="circular"
                                                className="h-full w-full shadow-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 flex w-full justify-center px-4 lg:order-3 lg:mt-0 lg:w-4/12 lg:justify-end lg:self-center">
                                    <a href="#comments">
                                        <Button
                                            className="bg-blue-600 mt-5 mx-1"
                                            onClick={() => {
                                                setShow(true);
                                            }}
                                        >
                                            Show & Add comments
                                        </Button>
                                        <div className="mx-10">
                                            {" "}
                                            {
                                                <h2>
                                                    {" "}
                                                    {comments?.length}: comments
                                                </h2>
                                            }
                                        </div>
                                    </a>
                                    <a>
                                        <button
                                            className=" mt-5 px-8 py-3  leading-4 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 text-sm"
                                            onClick={() => {
                                                navigate("/employees");
                                            }}
                                        >
                                            Back to All Employee
                                        </button>
                                    </a>
                                </div>
                                <div className="w-full px-4 lg:order-1 lg:w-4/12">
                                    <div className="flex justify-center py-4 pt-8 lg:pt-4"></div>
                                </div>
                            </div>
                            <div className="my-8 text-center">
                                <Typography
                                    variant="h2"
                                    color="blue-gray"
                                    className="mb-2"
                                    children={1}
                                >
                                    {employee?.firstname} {employee?.lastname}
                                </Typography>
                                <div className="mb-10 flex items-center justify-center gap-2">
                                    <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-700" />
                                    <Typography className="font-medium text-blue-gray-700">
                                        {employee.country}
                                    </Typography>
                                </div>
                                <div className="mb-5 flex items-center justify-center gap-2">
                                    <Typography className="font-medium text-blue-gray-700">
                                        open to work in : {employee.work_hours}
                                    </Typography>
                                </div>
                                <div className="mb-2 flex items-center justify-center gap-2">
                                    <Typography className="font-medium text-blue-gray-700">
                                        age : {employee.age} years
                                    </Typography>
                                </div>
                                <div className="mb-2 flex items-center justify-center gap-2">
                                    <BuildingLibraryIcon className="-mt-px h-4 w-4 text-blue-gray-700" />
                                    <Typography className="font-medium text-blue-gray-700">
                                        Member Of Geeks App
                                    </Typography>
                                </div>
                                <div className="mb-2 flex items-center justify-center gap-2">
                                    <Typography className="font-medium text-blue-gray-700">
                                        Work Description :{" "}
                                        {employee.description}
                                    </Typography>
                                </div>
                                <Button
                                    className="bg-blue-600 mt-5 mx-1"
                                    onClick={() => {
                                        newConversation();
                                    }}
                                >
                                    Chat Now
                                </Button>
                            </div>
                            <div className="mb-10 border-t border-blue-gray-50 py-6 text-center">
                                <div className="mt-2 flex flex-wrap justify-center">
                                    <div className="flex w-full flex-col items-center px-4 lg:w-9/12">
                                        <Typography className="mb-8 font-normal text-blue-gray-500">
                                            <Button
                                                className="bg-red-500 mt-5 mx-1"
                                                onClick={handleHire}
                                            >
                                                Hire Craftman
                                            </Button>
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="comments"></div>
                {show && (
                    <>
                        <div id="contant">
                            <label
                                className="text-gray-700 dark:text-gray-100 mx-10"
                                htmlFor="LastName"
                            >
                                Comments
                            </label>
                            <input
                                id="LastName"
                                type="email"
                                className="block w-200 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring font-size-10 mx-10"
                                onChange={(e) => {
                                    setcomment(e.target.value);
                                }}
                            />
                            {tokenUser && (
                                <button
                                    on
                                    onClick={(e) => addFeadBackFromUser()}
                                    className="block w-200 px-4 py-2 -mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-blue-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring font-size-10 -mx-12"
                                >
                                    Addcomment
                                </button>
                            )}
                        </div>
                        {comments &&
                            comments.map((comment, id) => {
                                return (
                                    <>
                                        <div id="comments">
                                            <div className="flex justify-start">
                                                <span>
                                                    <img
                                                        src="https://tse3.mm.bing.net/th?id=OIP.AkKR5-4AJhHTNNDMp0NxvQAAAA&pid=Api&P=0&h=220"
                                                        width={20}
                                                        height={30}
                                                    />
                                                </span>{" "}
                                                <span className="text-gray-300 w-20  mx-10">
                                                    User {comment.user_id}{" "}
                                                </span>
                                            </div>
                                            <div id="feadback">
                                                <span>{comment.comment}</span>
                                            </div>
                                            <span>
                                                {comment.user_id === userId && (
                                                    <button
                                                        key={comments[id].id}
                                                        onClick={() => {
                                                            DeleteCommentUser(
                                                                comments[id].id
                                                            );
                                                        }}
                                                        className="block w-200 px-4 py-2 -mt-10 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-red-600 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring font-size-10 mx-60"
                                                    >
                                                        Delete Comment
                                                    </button>
                                                )}
                                            </span>
                                        </div>
                                    </>
                                );
                            })}
                    </>
                )}
            </section>
        </>
    );
};

//! ======================================== export function  ====================================================

export default EmployeeDetails;

export const Message = ({ message, setMessage }) => {
    return (
        <div className="flex fixed right-10 shadow-md gap-6 rounded-lg overflow-hidden divide-x max-w-2xl dark:bg-gray-900 dark:text-gray-100 divide-gray-700">
            <div className="flex flex-1 flex-col p-4 border-l-8 dark:border-violet-400">
                <span className="text-2xl">{message}</span>
            </div>
            <button
                onClick={() => {
                    setMessage("");
                }}
                className="px-4 flex items-center text-xs uppercase tracki dark:text-gray-400 dark:border-gray-700"
            >
                Dismiss
            </button>
        </div>
    );
};
