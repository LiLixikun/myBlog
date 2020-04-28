import React from 'react';
// import { Anchor } from 'antd';
import { last } from 'lodash';

export default class Tocify {


    constructor() {
        this.anchors = [];
        this.tocItems = [];
    }

    add(text, level, id) {
        const count = this.anchors.filter(anchor => anchor === text).length;
        const anchor = id || (count ? `${text}${count}` : text);
        this.anchors.push(anchor);
        const item = { anchor, level, text };
        const items = this.tocItems;

        if (items.length === 0) { // 第一个 item 直接 push
            items.push(item);
        } else {
            let lastItem = last(items); // 最后一个 item

            if (item.level > lastItem.level) { // item 是 lastItem 的 children
                for (let i = lastItem.level + 1; i <= 6; i++) {
                    const { children } = lastItem;
                    if (!children) { // 如果 children 不存在
                        lastItem.children = [item];
                        break;
                    }

                    // 重置 lastItem 为 children 的最后一个 item
                    lastItem = last(children);

                    // item level 小于或等于 lastItem level 都视为与 children 同级
                    if (item.level <= lastItem.level) {
                        children.push(item);
                        break;
                    }
                }
            } else { // 置于最顶级
                items.push(item);
            }
        }

        return anchor;
    }

    reset = () => {
        this.tocItems = [];
        this.anchors = [];
    };

    renderToc(items) { // 递归 render
        return items.map(item => (
            <a key={item.anchor} href={`#${item.anchor}`} title={item.text}>
                {item.children && this.renderToc(item.children)}
            </a>
        ));
    }

    render() {
        return (
            <div style={{ padding: 24 }}>
                {this.renderToc(this.tocItems)}
            </div>
        );
    }
}
