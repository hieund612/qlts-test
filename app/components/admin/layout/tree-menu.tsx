"use client";
import { BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TreeMenu({ node, pathname, lever }: { node: any, pathname: string, lever: number }) {
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [submenuIndex, setSubmenuIndex] = useState(0);
    const router = useRouter();

    return (
        <>
            {
                node.parentId && node.parentId > 0 ? (
                    <li
                        className={`flex items-center gap-x-4 cursor-pointer p-2 pr-5 hover:bg-lemonyellow rounded-md
                    ${node.url && node.url === pathname ? "active" : ""} ${"pdl-" + (lever + 5)}`
                        }
                        onClick={() => {
                            setSubmenuIndex(node.id);
                            if (node.id !== submenuIndex) {
                                setSubmenuOpen(false);
                                setSubmenuOpen(true);
                            } else {
                                setSubmenuOpen(!submenuOpen);
                            }
                            if (node.url && node.url != "/-") {
                                let newUrl = node.url;
                                router.push(newUrl);
                            }
                        }}
                    >
                        {
                            node.childrens?.length > 0 ? (
                                <>
                                    <span className="flex-1">{node.title}</span>
                                    <BsChevronDown
                                        className={`${submenuOpen && submenuIndex === node.id && "rotate-180"}`}
                                    />
                                </>
                            ) : (
                                <>
                                    <Link href={node.url}>
                                        {node.title}
                                    </Link>
                                </>
                            )}
                    </li>
                ) : (
                    <li
                        className="flex items-center gap-x-2 cursor-pointer p-1 hover:bg-lemonyellow rounded-md mt-3"
                        onClick={() => {
                            setSubmenuIndex(node.id);
                            if (node.id !== submenuIndex) {
                                setSubmenuOpen(false);
                                setSubmenuOpen(true);
                            } else {
                                setSubmenuOpen(!submenuOpen);
                            }
                            if (node.url && node.url != "/-") {
                                let newUrl = node.url;
                                router.push(newUrl);
                            }
                        }}
                    >
                        {
                            node.childrens?.length > 0 ? (
                                <>
                                    <span className="text-xl block float-left">
                                        <RiDashboardFill />
                                    </span>
                                    <span className="text-sm font-medium flex-1">
                                        {node.title}
                                    </span>
                                    <BsChevronDown
                                        className={`${submenuOpen && submenuIndex === node.id && "rotate-180"}`}
                                    />
                                </>
                            ) : (
                                <>
                                    <span className="text-xl block float-left">
                                        <RiDashboardFill />
                                    </span>
                                    <span className="text-sm font-medium flex-1">
                                        <Link href={node.url}>
                                            {node.title}
                                        </Link>
                                    </span>
                                </>
                            )}
                    </li>
                )}
            {
                node.childrens?.length > 0 &&
                submenuOpen && submenuIndex === node.id && (
                    <ul>
                        {
                            node.childrens.map((child: any) => (
                                <TreeMenu
                                    key={child.id}
                                    node={child}
                                    pathname={pathname}
                                    lever={lever + 1}
                                />
                            ))}
                    </ul>
                )}
        </>
    );
}
