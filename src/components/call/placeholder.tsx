"use client";

import { use } from "react";
import ProfilePicture from "../profile-picture";
import { CallerInfoContext } from "../providers/caller-info.provider";

const Placeholder = () => {
  const callerInfo = use(CallerInfoContext);

  return (
    <div className="flex flex-col gap-4 group-data-[isminimized=true]:gap-2 items-center mt-6">
      <div className="relative size-36 group-data-[isminimized=true]:size-16 rounded-full mb-2 transition-all duration-200">
        <ProfilePicture
          ownerName={callerInfo.username}
          src={callerInfo.avatar}
          fill
          sizes="288px"
        />
      </div>
      <div className="flex flex-col gap-2 group-data-[isminimized=true]:gap-0.5 items-center *:transition-all *:duration-200">
        <p className="group-data-[isminimized=true]:text-sm">
          {callerInfo.username}
        </p>
        <p className="text-sm group-data-[isminimized=true]:text-xs">
          Calling...
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
