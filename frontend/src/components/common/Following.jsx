const Following = ({ user ,isPending}) => {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={user?.profileImage || "/avatar-placeholder.png"} />
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
          {!isPending && "Unfollow"}
        </button>
        {/* <button className="btn btn-ghost btn-xs">UnFollow</button> */}
      </th>
    </tr>
  );
};
export default Following;
