import { cn } from "@/lib/utils";
import React from "react";
import NavItem from "./NavItem";

interface Prop {
  className?: string;
}
const NavMenu = ({ className }: Prop) => {
  return (
    <nav className={cn("", className)}>
      <ul className="flex gap-10">
        <NavItem path="/girls" text="girls for sex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 50 50"
            className="text-gray-700 group-hover:text-primary"
          >
            <circle
              cx={22.875}
              cy={4.625}
              r={4.125}
              fill="currentColor"
            ></circle>
            <path
              fill="currentColor"
              d="M22 10h-3c-2.82 0-5 1.719-5 4.587V27c0 2 3 2 3 0V15h1v32c0 1.233.768 2 2 2c1.235 0 2-.767 2-2zm13 15l-4.017-10.357C30.634 12.322 28.29 10 25.615 10H23v23.783c.5.002 1 .075 1 .217v13c0 1.04.917 2 2 2c1.086 0 2-.961 2-2V34h3.869c.362 0 1.044-.654 1.044-1c0-.08.029-.931 0-1l-5.909-16.237l-.034-.167c0-.237.199-.429.447-.429c.211 0 .388.141.435.329L31.869 26c.267.601 1.365 1 2.087 1c.965 0 1.065-1.895 1.044-2"
            ></path>
          </svg>
        </NavItem>
        <NavItem path="erotic-massages" text="erotic massages">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={35}
            height={35}
            viewBox="0 0 48 48"
            className="text-gray-700 group-hover:text-primary mr-2 mt-3"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth={4}
            >
              <path
                fill="currentColor"
                d="M14 17a2 2 0 0 1 2-2h26a2 2 0 0 1 2 2v6H14z"
              ></path>
              <path
                strokeLinecap="round"
                d="M26 23L14 37m18-14l12 14M14 23H6m33 8H19M6 13v10m8 0v17m30-17v17M9 14l-6-2"
              ></path>
            </g>
          </svg>
        </NavItem>
        <NavItem path="bdsm" text="bdsm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={45}
            height={45}
            viewBox="0 0 24 24"
            className="text-gray-700 group-hover:text-primary"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 17a1 1 0 1 0 2 0a1 1 0 1 0-2 0M8 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 22l4-2v-3h12m-9 3h9M8 14l3-2l1-4c3 1 3 4 3 6"
            ></path>
          </svg>
        </NavItem>
        <NavItem path="/agencies" text="businesses">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={35}
            height={35}
            viewBox="0 0 24 24"
            className="text-gray-700 group-hover:text-primary"
          >
            <path
              fill="currentColor"
              d="m14.925 19.15l4.95-4.95q.3-.3.713-.287t.712.312t.3.7t-.3.7l-5.675 5.65q-.15.15-.325.225t-.375.075t-.375-.075t-.325-.225L11.4 18.45q-.3-.3-.3-.7t.3-.7t.7-.3t.7.3zM6 20q-.825 0-1.412-.587T4 18v-7.375L3 11.4q-.325.25-.737.2t-.663-.4q-.25-.325-.187-.725t.387-.65l8.975-6.9q.275-.2.588-.3t.637-.1t.638.1t.587.3L22.2 9.8q.325.25.388.65t-.213.75q-.25.325-.638.388T21 11.4l-.675-.5l-5.4 5.425l-.675-.675q-.875-.9-2.15-.9t-2.15.9q-.875.875-.85 2.175T10 20z"
              strokeWidth={0.5}
              stroke="currentColor"
            ></path>
          </svg>
        </NavItem>
        <NavItem path="blog" text="blog">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10 text-gray-700 group-hover:text-primary mt-3.5"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </svg>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={28}
            viewBox="0 0 14 14"
            className="text-gray-700 group-hover:text-primary mt-3.5"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2.36 1.36c.07-.07.166-.11.265-.11H7A.625.625 0 1 0 7 0H2.625A1.625 1.625 0 0 0 1 1.625v8.649l-.968 2.903a.625.625 0 0 0 .745.804L4.702 13h7.673A1.625 1.625 0 0 0 14 11.375V7a.625.625 0 1 0-1.25 0v4.375a.375.375 0 0 1-.375.375h-7.75a.6.6 0 0 0-.152.019l-2.895.724l.64-1.92a.6.6 0 0 0 .032-.198v-8.75c0-.1.04-.195.11-.265M10.726.246a1.5 1.5 0 0 1 1.641.328h.001l1.057 1.058h.001a1.5 1.5 0 0 1 0 2.129L8.716 8.49a.5.5 0 0 1-.265.139l-3 .54a.5.5 0 0 1-.582-.573l.5-3.04a.5.5 0 0 1 .14-.274L10.24.573a1.5 1.5 0 0 1 .486-.327"
              clipRule="evenodd"
              strokeWidth={0.5}
              stroke="currentColor"
            ></path>
          </svg> */}
        </NavItem>
      </ul>
    </nav>
  );
};

export default NavMenu;
