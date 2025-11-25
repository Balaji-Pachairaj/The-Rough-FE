import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("speciesList", "routes/Species/list.tsx"),
  // route("post/:postid", "routes/post.tsx"),
] satisfies RouteConfig;
