import {  useMutation, useQuery} from "@tanstack/react-query";
import { useState ,useEffect} from "react";

const FollowingList = ({ user }) => {
  const [UserConnections, setUserConnections] = useState([]);
  const action = "GetFollowing"; 
  const { data,isLoading,refetch,isRefetching} = useQuery({
    queryKey:["UserConnections"],
    queryFn: async () => {
      try {
        const userIds = user?.following || [];
        console.log("userIds",userIds);
        const res = await fetch(`/api/users/connections/${action}`, {
          method: "POsT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setUserConnections(data);
        return data;

      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!user?.following, 
    
  });
  
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
          {UserConnections.length === 0 && (
            <p>This user is not following anyone.</p>
          )}
          <div className="overflow-x-auto">
          <p>This user is not following anyone.</p>
            <table className="table">
            {UserConnections.map((user) => (
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
                   <button className="btn btn-ghost btn-xs">UnFollow</button>
                 </th>
               </tr>
               
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
{/* {followingList.map((user) =>{
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
   })}; */}