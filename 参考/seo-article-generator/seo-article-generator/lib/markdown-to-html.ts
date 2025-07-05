import { remark } from "remark"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import { visit } from "unist-util-visit"
import { h } from "hastscript"

// Google AdSense広告を挿入するrehypeプラグイン
function rehypeAdsensePlugin(options: { clientId: string; slotId: string }) {
  return (tree: any) => {
    let h2Count = 0
    const adInsertPositions = [2, 4, 6] // 2つ目、4つ目、6つ目のH2見出しの後に挿入

    // 記事の冒頭に広告を挿入
    const topAdNode = h("div", { style: "text-align: center; margin: 20px 0;" }, [
      h("ins", {
        class: "adsbygoogle",
        style: "display:block; text-align:center;",
        "data-ad-layout": "in-article",
        "data-ad-format": "fluid",
        "data-ad-client": options.clientId,
        "data-ad-slot": options.slotId,
      }),
      h("script", "(adsbygoogle = window.adsbygoogle || []).push({});"),
    ])
    // Insert at the beginning of the body (assuming HTML structure)
    // For a simple markdown to HTML, it's usually at the beginning of the root children.
    if (tree.children && tree.children.length > 0) {
      tree.children.splice(0, 0, topAdNode)
    } else {
      tree.children = [topAdNode]
    }

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "h2") {
        h2Count++
        if (adInsertPositions.includes(h2Count) && parent && index !== null) {
          const adNode = h("div", { style: "text-align: center; margin: 20px 0;" }, [
            h("ins", {
              class: "adsbygoogle",
              style: "display:block; text-align:center;",
              "data-ad-layout": "in-article",
              "data-ad-format": "fluid",
              "data-ad-client": options.clientId,
              "data-ad-slot": options.slotId,
            }),
            h("script", "(adsbygoogle = window.adsbygoogle || []).push({});"),
          ])
          // H2の直後に広告ノードを挿入
          parent.children.splice(index + 1, 0, adNode)
          return [visit.SKIP, index + 1] // 新しいノードをスキップして、次の要素から再開
        }
      }
    })

    // 記事の末尾にフッター広告を挿入
    const footerAdNode = h("div", { style: "text-align: center; margin-top: 40px; margin-bottom: 20px;" }, [
      h("ins", {
        class: "adsbygoogle",
        style: "display:block",
        "data-ad-client": options.clientId,
        "data-ad-slot": options.slotId,
        "data-ad-format": "auto",
        "data-full-width-responsive": "true",
      }),
      h("script", "(adsbygoogle = window.adsbygoogle || []).push({});"),
    ])
    tree.children.push(footerAdNode)
  }
}

// 新しいアフィリエイト広告を挿入するrehypeプラグイン
function rehypeAffiliatePlugin(options: {
  affiliateTag: string | null
  insertPosition: "start" | "middle" | "end" | null
  h2Interval: number
}) {
  return (tree: any) => {
    if (!options.affiliateTag || !options.insertPosition) {
      return // アフィリエイトタグまたは挿入位置が指定されていない
    }

    const affiliateNode = h(
      "div",
      {
        class: "affiliate-ad", // スタイリング用のクラスを追加
        style: "text-align: center; margin: 20px 0;",
      },
      [
        { type: "raw", value: options.affiliateTag }, // 生のHTMLを挿入
      ],
    )

    if (options.insertPosition === "start") {
      if (tree.children && tree.children.length > 0) {
        tree.children.splice(0, 0, affiliateNode)
      } else {
        tree.children = [affiliateNode]
      }
    } else if (options.insertPosition === "end") {
      tree.children.push(affiliateNode)
    } else if (options.insertPosition === "middle") {
      let h2Count = 0
      visit(tree, "element", (node, index, parent) => {
        if (node.tagName === "h2") {
          h2Count++
          if (h2Count % options.h2Interval === 0 && parent && index !== null) {
            parent.children.splice(index + 1, 0, affiliateNode)
            return [visit.SKIP, index + 1] // 新しく挿入されたノードをスキップして、次の要素から再開
          }
        }
      })
    }
  }
}

export async function markdownToHtml(
  markdown: string,
  clientId: string,
  slotId: string,
  affiliateTag: string | null = null,
  affiliateInsertPosition: "start" | "middle" | "end" | null = null,
  affiliateH2Interval = 2,
): Promise<string> {
  const file = await remark()
    .use(remarkParse) // MarkdownをASTにパース
    .use(remarkRehype, { allowDangerousHtml: true }) // ASTをHTMLのASTに変換 (危険なHTMLを許可)
    .use(rehypeRaw) // HTMLのAST内の生のHTMLを処理
    .use(rehypeAdsensePlugin, { clientId, slotId }) // AdSenseプラグインを適用
    .use(rehypeAffiliatePlugin, {
      affiliateTag,
      insertPosition: affiliateInsertPosition,
      h2Interval: affiliateH2Interval,
    }) // 新しいアフィリエイトプラグインを適用
    .use(rehypeStringify) // HTMLのASTを文字列に変換
    .process(markdown)

  return String(file)
}
