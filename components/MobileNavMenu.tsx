"use client";
import Link from "next/link";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Minus, PhoneCall, Plus } from "lucide-react";
import { location } from "@/fixtures/location";

const MobileNavMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="bg-dark-slate">
      <ul>
        <li>
          <Link className="flex items-center gap-2" href={""}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              className="text-dark-slate"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.854 4H9.146C6.65 4 4.53 5.964 3.753 8.7c-.255.901-.383 1.352-.062 1.826c.32.474.843.474 1.888.474h12.843c1.044 0 1.567 0 1.888-.474s.193-.925-.063-1.826C19.471 5.964 17.35 4 14.854 4M6 15h-.422c-1.044 0-1.567 0-1.887.339c-.321.338-.193.66.062 1.304C4.529 18.597 6.65 20 9.146 20h5.708c2.496 0 4.617-1.403 5.393-3.357c.256-.644.383-.966.062-1.304C19.99 15 19.466 15 18.422 15H14m5 0h1a2 2 0 1 0 0-4h-8m-7 4H4a2 2 0 1 1 0-4h2m0 0l1.481 1.728c.706.824 1.06 1.235 1.519 1.235c.46 0 .813-.411 1.518-1.235L12 11m-6 0h6M9.008 8h-.01M15 7l-1 1"
              ></path>
            </svg>
            <div className="flex-1 font-medium text-base py-3 uppercase border-y-2 text-white">
              sexshop
            </div>
          </Link>
        </li>

        <li>
          <Link href="" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
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
            <div className="flex-1 flex pr-5 items-center justify-between  font-medium text-base py-3 uppercase border-b-2 text-white">
              <span>girls for sex</span>

              <button onClick={() => setIsOpen(!isOpen)} className="">
                {isOpen ? (
                  <Minus className="h-6 w-6" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </button>
            </div>
          </Link>
          {/* render locations */}
          <div className=" ml-8  w-full border-white">
            {isOpen &&
              location.map((item) => (
                <Link
                  className="text-primary my-2 text-lg font-medium flex flex-col uppercase"
                  href={""}
                >
                  {`Sex ${item.location}`}
                </Link>
              ))}
          </div>
        </li>

        <li>
          <Link className="flex items-center gap-2" href={"erotic-massages"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 48 48"
              className="text-gray-700 group-hover:text-primary "
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
            <div className="flex-1 font-medium text-base py-3 uppercase border-b-2 text-white">
              erotic massages
            </div>
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-2" href={"bdsm"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
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
            <div className="flex-1 font-medium text-base py-3 uppercase border-b-2 text-white">
              bdsm
            </div>
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-2" href={"businesses"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
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
            <div className="flex-1 font-medium text-base py-3 uppercase border-b-2 text-white">
              erotic businesses
            </div>
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-2" href={"blog"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="-2 -2 24 24"
              className="text-gray-700"
            >
              <path
                fill="currentColor"
                d="m5.72 14.456l1.761-.508l10.603-10.73a.456.456 0 0 0-.003-.64l-.635-.642a.443.443 0 0 0-.632-.003L6.239 12.635zM18.703.664l.635.643c.876.887.884 2.318.016 3.196L8.428 15.561l-3.764 1.084a.9.9 0 0 1-1.11-.623a.9.9 0 0 1-.002-.506l1.095-3.84L15.544.647a2.215 2.215 0 0 1 3.159.016zM7.184 1.817c.496 0 .898.407.898.909a.903.903 0 0 1-.898.909H3.592c-.992 0-1.796.814-1.796 1.817v10.906c0 1.004.804 1.818 1.796 1.818h10.776c.992 0 1.797-.814 1.797-1.818v-3.635c0-.502.402-.909.898-.909s.898.407.898.91v3.634c0 2.008-1.609 3.636-3.593 3.636H3.592C1.608 19.994 0 18.366 0 16.358V5.452c0-2.007 1.608-3.635 3.592-3.635z"
                strokeWidth={0.5}
                stroke="currentColor"
              ></path>
            </svg>
            <div className="flex-1 font-medium text-base py-3 uppercase border-b-2 text-white">
              blog
            </div>
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-2" href={"blog"}>
            {/* <PhoneCall className="" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide  lucide-phone-call-icon lucide-phone-call text-gray-700"
            >
              <path d="M13 2a9 9 0 0 1 9 9" />
              <path d="M13 6a5 5 0 0 1 5 5" />
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            <div className="flex-1 font-medium text-base py-3 uppercase border-b-2 text-white">
              contact
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileNavMenu;
