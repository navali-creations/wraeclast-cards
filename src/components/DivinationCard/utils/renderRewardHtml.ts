import { createElement, type ReactNode } from "react";
import { getColorForClass } from "./tc-colors";

function domNodeToReact(node: Node, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }
  const el = node as HTMLElement;
  const children = [...el.childNodes].map((child, i) =>
    domNodeToReact(child, i),
  );

  if (el.tagName === "SPAN" && el.classList.contains("tc")) {
    const colorClass = [...el.classList].find((t) => t.startsWith("-"));
    const color = colorClass ? getColorForClass(colorClass) : undefined;
    return createElement(
      "span",
      { key, style: color ? { color } : undefined },
      ...children,
    );
  }

  return createElement(el.tagName.toLowerCase(), { key }, ...children);
}

export function renderRewardHtml(html: string): ReactNode {
  if (!html || typeof DOMParser === "undefined") return html;
  const doc = new DOMParser().parseFromString(
    `<div>${html}</div>`,
    "text/html",
  );
  const root = doc.body.firstElementChild;
  if (!root) return html;
  return [...root.childNodes].map((node, i) => domNodeToReact(node, i));
}

export function getRewardPlainText(html: string): string {
  if (!html || typeof DOMParser === "undefined") return html;
  const doc = new DOMParser().parseFromString(
    `<div>${html}</div>`,
    "text/html",
  );
  const root = doc.body.firstElementChild;
  if (!root) return html;

  const segments: string[] = [];
  let current = "";
  for (const node of root.childNodes) {
    if (node.nodeName === "BR") {
      if (current.trim()) segments.push(current.trim());
      current = "";
    } else {
      current += node.textContent ?? "";
    }
  }
  if (current.trim()) segments.push(current.trim());

  return segments.join(", ");
}
