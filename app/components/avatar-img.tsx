import styles from "./avatar-img.module.scss";
import * as React from "react";
import NextImage from "next/image";

export function AvatarImg(props: { src: string }) {
  return (
    <NextImage
      src={props.src}
      width={32}
      height={32}
      alt="avatar"
      className={styles["avatar-img"]}
    />
  );
}
