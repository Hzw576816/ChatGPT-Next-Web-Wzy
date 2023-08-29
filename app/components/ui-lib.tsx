/* eslint-disable @next/next/no-img-element */
import styles from "./ui-lib.module.scss";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";
import DownIcon from "../icons/down.svg";
import ConfirmIcon from "../icons/confirm.svg";
import CancelIcon from "../icons/cancel.svg";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";
import PinIcon from "../icons/pin.svg";

import Locale from "../locales";

import { createRoot } from "react-dom/client";
import React, { HTMLProps, useEffect, useState } from "react";
import { IconButton } from "./button";
import { copyToClipboard } from "../utils";
import GithubIcon from "@/app/icons/github.svg";

export function Popover(props: {
  children: JSX.Element;
  content: JSX.Element;
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className={styles.popover}>
      {props.children}
      {props.open && (
        <div className={styles["popover-content"]}>
          <div className={styles["popover-mask"]} onClick={props.onClose}></div>
          {props.content}
        </div>
      )}
    </div>
  );
}

export function Card(props: { children: JSX.Element[]; className?: string }) {
  return (
    <div className={styles.card + " " + props.className}>{props.children}</div>
  );
}

export function ListItem(props: {
  title?: string;
  subTitle?: string;
  children?: JSX.Element | JSX.Element[];
  icon?: JSX.Element;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={styles["list-item"] + ` ${props.className || ""}`}
      onClick={props.onClick}
    >
      <div className={styles["list-header"]}>
        {props.icon && <div className={styles["list-icon"]}>{props.icon}</div>}
        <div className={styles["list-item-title"]}>
          <div>{props.title}</div>
          {props.subTitle && (
            <div className={styles["list-item-sub-title"]}>
              {props.subTitle}
            </div>
          )}
        </div>
      </div>
      {props.children}
    </div>
  );
}

export function List(props: {
  children:
    | Array<JSX.Element | null | undefined>
    | JSX.Element
    | null
    | undefined;
}) {
  return <div className={styles.list}>{props.children}</div>;
}

export function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingIcon />
    </div>
  );
}

interface ModalProps {
  title: string;
  children?: any;
  actions?: JSX.Element[];
  defaultMax?: boolean;
  onClose?: () => void;
}

export function Modal(props: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isMax, setMax] = useState(!!props.defaultMax);

  return (
    <div
      className={
        styles["modal-container"] + ` ${isMax && styles["modal-container-max"]}`
      }
    >
      <div className={styles["modal-header"]}>
        <div className={styles["modal-title"]}>{props.title}</div>

        <div className={styles["modal-header-actions"]}>
          <div
            className={styles["modal-header-action"]}
            onClick={() => setMax(!isMax)}
          >
            {isMax ? <MinIcon /> : <MaxIcon />}
          </div>
          <div
            className={styles["modal-header-action"]}
            onClick={props.onClose}
          >
            <CloseIcon />
          </div>
        </div>
      </div>

      <div className={styles["modal-content"]}>{props.children}</div>

      <div className={styles["modal-footer"]}>
        <div className={styles["modal-actions"]}>
          {props.actions?.map((action, i) => (
            <div key={i} className={styles["modal-action"]}>
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function showModal(props: ModalProps) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    props.onClose?.();
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<Modal {...props} onClose={closeModal}></Modal>);
}

export type ToastProps = {
  content: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  onClose?: () => void;
};

export function Toast(props: ToastProps) {
  return (
    <div className={styles["toast-container"]}>
      <div className={styles["toast-content"]}>
        <span>{props.content}</span>
        {props.action && (
          <button
            onClick={() => {
              props.action?.onClick?.();
              props.onClose?.();
            }}
            className={styles["toast-action"]}
          >
            {props.action.text}
          </button>
        )}
      </div>
    </div>
  );
}

export function showToast(
  content: string,
  action?: ToastProps["action"],
  delay = 3000,
) {
  const div = document.createElement("div");
  div.className = styles.show;
  document.body.appendChild(div);

  const root = createRoot(div);
  const close = () => {
    div.classList.add(styles.hide);

    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 300);
  };

  setTimeout(() => {
    close();
  }, delay);

  root.render(<Toast content={content} action={action} onClose={close} />);
}

export type InputProps = React.HTMLProps<HTMLTextAreaElement> & {
  autoHeight?: boolean;
  rows?: number;
};

export function Input(props: InputProps) {
  return (
    <textarea
      {...props}
      className={`${styles["input"]} ${props.className}`}
    ></textarea>
  );
}

export function PasswordInput(props: HTMLProps<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  function changeVisibility() {
    setVisible(!visible);
  }

  return (
    <div className={"password-input-container"}>
      <IconButton
        icon={visible ? <EyeIcon /> : <EyeOffIcon />}
        onClick={changeVisibility}
        className={"password-eye"}
      />
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={"password-input"}
      />
    </div>
  );
}

export function SingleInput(props: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="text"
      className={`${styles["input"]} ${styles["input-left"]} ${props.className}`}
    />
  );
}

export function Select(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
) {
  const { className, children, ...otherProps } = props;
  return (
    <div className={`${styles["select-with-icon"]} ${className}`}>
      <select className={styles["select-with-icon-select"]} {...otherProps}>
        {children}
      </select>
      <DownIcon className={styles["select-with-icon-icon"]} />
    </div>
  );
}

export function showConfirm(content: any) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    root.unmount();
    div.remove();
  };

  return new Promise<boolean>((resolve) => {
    root.render(
      <Modal
        title={Locale.UI.Confirm}
        actions={[
          <IconButton
            key="cancel"
            text={Locale.UI.Cancel}
            onClick={() => {
              resolve(false);
              closeModal();
            }}
            icon={<CancelIcon />}
            tabIndex={0}
            bordered
            shadow
          ></IconButton>,
          <IconButton
            key="confirm"
            text={Locale.UI.Confirm}
            type="primary"
            onClick={() => {
              resolve(true);
              closeModal();
            }}
            icon={<ConfirmIcon />}
            tabIndex={0}
            autoFocus
            bordered
            shadow
          ></IconButton>,
        ]}
        onClose={closeModal}
      >
        {content}
      </Modal>,
    );
  });
}

function PromptInput(props: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const [input, setInput] = useState(props.value);
  const onInput = (value: string) => {
    props.onChange(value);
    setInput(value);
  };

  return (
    <textarea
      className={styles["modal-input"]}
      autoFocus
      value={input}
      onInput={(e) => onInput(e.currentTarget.value)}
      rows={props.rows ?? 3}
    ></textarea>
  );
}

export function showPrompt(content: any, value = "", rows = 3) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    root.unmount();
    div.remove();
  };

  return new Promise<string>((resolve) => {
    let userInput = value;

    root.render(
      <Modal
        title={content}
        actions={[
          <IconButton
            key="cancel"
            text={Locale.UI.Cancel}
            onClick={() => {
              closeModal();
            }}
            icon={<CancelIcon />}
            bordered
            shadow
            tabIndex={0}
          ></IconButton>,
          <IconButton
            key="confirm"
            text={Locale.UI.Confirm}
            type="primary"
            onClick={() => {
              resolve(userInput);
              closeModal();
            }}
            icon={<ConfirmIcon />}
            bordered
            shadow
            tabIndex={0}
          ></IconButton>,
        ]}
        onClose={closeModal}
      >
        <PromptInput
          onChange={(val) => (userInput = val)}
          value={value}
          rows={rows}
        ></PromptInput>
      </Modal>,
    );
  });
}

export function showImageModal(img: string) {
  showModal({
    title: Locale.Export.Image.Modal,
    children: (
      <div>
        <img
          src={img}
          alt="preview"
          style={{
            maxWidth: "100%",
          }}
        ></img>
      </div>
    ),
  });
}

export function Selector<T>(props: {
  items: Array<{
    title: string;
    subTitle?: string;
    value: T;
  }>;
  defaultSelectedValue?: T;
  onSelection?: (selection: T[]) => void;
  onClose?: () => void;
  multiple?: boolean;
}) {
  return (
    <div className={styles["selector"]} onClick={() => props.onClose?.()}>
      <div className={styles["selector-content"]}>
        <List>
          {props.items.map((item, i) => {
            const selected = props.defaultSelectedValue === item.value;
            return (
              <ListItem
                className={styles["selector-item"]}
                key={i}
                title={item.title}
                subTitle={item.subTitle}
                onClick={() => {
                  props.onSelection?.([item.value]);
                  props.onClose?.();
                }}
              >
                {selected ? (
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "var(--primary)",
                      borderRadius: 10,
                    }}
                  ></div>
                ) : (
                  <></>
                )}
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
}

export function DangerousListItem(props: {
  title?: string;
  subTitle?: string;
  children?: JSX.Element | JSX.Element[];
  icon?: JSX.Element;
  className?: string;
  titleCopy?: boolean;
}) {
  return (
    <div className={styles["list-item"] + ` ${props.className}`}>
      <div className={styles["list-header"]}>
        {props.icon && <div className={styles["list-icon"]}>{props.icon}</div>}
        <div className={styles["list-item-title"]}>
          {props.titleCopy && (
            <div
              dangerouslySetInnerHTML={{ __html: props.title || "" }}
              onClick={() => {
                copyToClipboard(props.title!);
              }}
            ></div>
          )}
          {!props.titleCopy && (
            <div dangerouslySetInnerHTML={{ __html: props.title || "" }}></div>
          )}
          {props.subTitle && (
            <div
              className={styles["list-item-sub-title"]}
              dangerouslySetInnerHTML={{ __html: props.subTitle }}
            ></div>
          )}
        </div>
      </div>
      {props.children}
    </div>
  );
}

export function ComboListItem(props: {
  id?: string;
  title?: string;
  price?: string;
  allowReChargeCount: number;
  discountedPrice?: string;
  attrs: any[];
  children?: JSX.Element | JSX.Element[];
}) {
  return (
    <div className={styles["price-combo-card"]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <div className={styles["title"]}>{props.title}</div>
          <div className={styles["right"]}>
            <div className={styles["price"]}>
              ￥ {props.discountedPrice}
              <span className={styles["origin-price"]}>￥ {props.price}</span>
            </div>
            <div className={styles["action"]}>{props.children}</div>
          </div>
        </div>
        <div className={styles["body"]}>
          {props.attrs.map((item, index) => {
            return (
              <div
                className={styles["item"]}
                key={item.label + index + props.id}
              >
                <div className={styles["icon"]}>
                  <IconButton
                    style={{ background: "none", padding: "10px 0" }}
                    icon={<PinIcon />}
                  />
                </div>
                <div className={styles["label"]}>{item.label}</div>
                <div className={styles["value"]}>{item.value}</div>
                <div className={styles["unit"]}>{item.unit}</div>
              </div>
            );
          })}
        </div>
      </div>
      {props.allowReChargeCount === 1 ? (
        <div className={styles["charge-privilege"]}>首次购买优惠</div>
      ) : (
        <></>
      )}
    </div>
  );
}

export function OrderListItem(props: {
  id: string;
  totalAmount: string;
  description: string;
  orderNo: string;
  ordersStatusText: string;
  attrs?: any[];
  payTime: string;
  createTime: string;
}) {
  return (
    <div className={styles["order-list-item"]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <div className={styles["title"]}>
            订单号: {props.orderNo}
            <div className={styles["sub-title"]}>{props.description}</div>
          </div>
          <div className={styles["right"]}>
            <div className={styles["price"]}>￥ {props.totalAmount}</div>
            <div className={styles["sub-title"]}>支付时间: {props.payTime}</div>
          </div>
        </div>
        <div className={styles["body"]}>
          {props.attrs?.map((item, index) => {
            return (
              <div
                className={styles["item"]}
                key={item.label + index + props.id}
              >
                <div className={styles["icon"]}>
                  <IconButton
                    style={{ background: "none", padding: "10px 0" }}
                    icon={<PinIcon />}
                  />
                </div>
                <div className={styles["label"]}>{item.label}</div>
                <div className={styles["value"]}>{item.value}</div>
                <div className={styles["unit"]}>{item.unit}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles["order-status"] + " success"}>
        {props.ordersStatusText}
      </div>
    </div>
  );
}

export function BalanceListItem(props: {
  id: string;
  title: string;
  endTime: string;
  createTime: string;
  status: string;
  statusText: string;
  attrs?: any[];
}) {
  return (
    <div className={styles["order-list-item"] + " " + styles[props.status]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <div className={styles["title"]}>{props.title}</div>
          <div className={styles["right"]}>
            <div className={styles["r-title"]}>到期时间: {props.endTime}</div>
            <div className={styles["sub-title"]}>
              购买时间: {props.createTime}
            </div>
          </div>
        </div>
        <div className={styles["body"]}>
          {props.attrs?.map((item, index) => {
            return (
              <div
                className={styles["item"]}
                key={item.label + index + props.id}
              >
                <div className={styles["icon"]}>
                  <IconButton
                    style={{ background: "none", padding: "10px 0" }}
                    icon={<PinIcon />}
                  />
                </div>
                <div className={styles["label"]}>{item.label}</div>
                <div className={styles["value"]}>{item.value}</div>
                <div className={styles["unit"]}>{item.unit}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles["order-status"] + " " + props.status}>
        {props.statusText}
      </div>
    </div>
  );
}
