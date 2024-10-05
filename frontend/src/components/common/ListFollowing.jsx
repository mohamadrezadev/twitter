import { useMutation, useQuery ,useQueryClient} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useFollow from "./hooks/useFollow";
const FollowingList = ({ user }) => {

  const queryClient=useQueryClient();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const action = "GetFollowing";
  const {
    data: UserConnections,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["UserConnections"],
    queryFn: async () => {
      try {
        const userIds = user?.following || [];
        const res = await fetch(`/api/users/connections/${action}`, {
          method: "POsT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const userIds = user?.following || [];


  return (
    <>
      <button
        className="text-slate-500 text-xs"
        onClick={() => document.getElementById("FollowingList").showModal()}
      >
        Following
      </button>
      <dialog id="FollowingList" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          {!isLoading && !isRefetching && UserConnections?.length === 0 && (
            <p className="text-center my-4">
              This user is not following anyone.👻
            </p>
          )}

          <div className="overflow-x-auto">
            <p>My following .</p>
            <table className="table">
              {UserConnections?.map((user) => (
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={
                                user?.profileImage || "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <th>
                      <button
                        className="btn btn-outline rounded-full btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          follow(user?._id);
                        }}
                      >
                        {isPending && "Loading..."}
                        {!isPending  && "Unfollow"}
                      </button>
                      {/* <button className="btn btn-ghost btn-xs">UnFollow</button> */}
                    </th>
                  </tr>
                  {console.log(user)}
                </tbody>
              ))}
            </table>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default FollowingList;
{
  /* {followingList.map((user) =>{
     {console.log(user)}
       <tr>
       <td>
         <div className="flex items-center gap-3">
           <div className="avatar">
             <div className="mask mask-squircle h-12 w-12">
               <img
                 src={ user?.profileImage || "/avatar-placeholder.png"} />
             </div>
           </div>
           <div>
             <div className="font-bold">Hart Hagerty</div>
             <div className="text-sm opacity-50">United States</div>
           </div>
         </div>
       </td>
       <td>
         Zemlak, Daniel and Leannon
         <br />
         <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
       </td>
       <td>Purple</td>
       <th>
         <button className="btn btn-ghost btn-xs">details</button>
       </th>
     </tr>
   })}; */
}
