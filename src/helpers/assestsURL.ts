import config from "../config/config";
import { baseAvatarUrl, baseMediaUrl } from "../constants";

export const getFullMediaUrl = (path: string): string => {
  return path ? config.server.domainAssets + baseMediaUrl + path : "";
};

export const getFullAvatarUrl = (path: string): string => {
  return path ? config.server.domainAssets + baseAvatarUrl + path : "";
};
