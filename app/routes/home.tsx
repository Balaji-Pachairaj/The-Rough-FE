import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Rough Draft" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div> Hellowrold</div>;
}
