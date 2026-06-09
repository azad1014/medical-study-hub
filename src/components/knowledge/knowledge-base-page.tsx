"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileText,
  Bookmark,
  BookmarkPlus,
  ListTree,
} from "lucide-react"

interface TreeNode {
  id: string
  name: string
  type: "科目" | "系统" | "主题" | "子主题"
  children?: TreeNode[]
  content?: string
}

const mockTreeData: TreeNode[] = [
  {
    id: "1",
    name: "病理学",
    type: "科目",
    children: [
      {
        id: "1-1",
        name: "炎症",
        type: "系统",
        children: [
          {
            id: "1-1-1",
            name: "急性炎症",
            type: "主题",
            content: "急性炎症是机体对组织损伤的快速防御反应...",
            children: [
              { id: "1-1-1-1", name: "血管变化", type: "子主题", content: "血管扩张，通透性增加..." },
              { id: "1-1-1-2", name: "细胞事件", type: "子主题", content: "中性粒细胞募集、趋化..." },
              { id: "1-1-1-3", name: "化学介质", type: "子主题", content: "组胺、前列腺素、细胞因子..." },
            ],
          },
          {
            id: "1-1-2",
            name: "慢性炎症",
            type: "主题",
            children: [
              { id: "1-1-2-1", name: "肉芽肿性", type: "子主题", content: "结核、结节病..." },
              { id: "1-1-2-2", name: "非肉芽肿性", type: "子主题", content: "自身免疫、异物..." },
            ],
          },
        ],
      },
      {
        id: "1-2",
        name: "肿瘤",
        type: "系统",
        children: [
          { id: "1-2-1", name: "良性肿瘤", type: "主题" },
          { id: "1-2-2", name: "恶性肿瘤", type: "主题" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "药理学",
    type: "科目",
    children: [
      {
        id: "2-1",
        name: "自主神经药物",
        type: "系统",
        children: [
          { id: "2-1-1", name: "胆碱能药", type: "主题" },
          { id: "2-1-2", name: "抗胆碱能药", type: "主题" },
          { id: "2-1-3", name: "肾上腺素能药", type: "主题" },
        ],
      },
    ],
  },
]

function TreeNodeItem({
  node,
  depth = 0,
  selectedId,
  onSelect,
}: {
  node: TreeNode
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedId === node.id

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded)
          onSelect(node.id)
        }}
        className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
          isSelected
            ? "bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300"
            : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          )
        ) : (
          <FileText className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
        {node.type === "科目" && (
          <Badge variant="outline" className="ml-auto text-xs px-1 py-0">
            {node.children?.length || 0}
          </Badge>
        )}
      </button>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function KnowledgeBasePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const selectedNode = selectedId ? findNode(mockTreeData, selectedId) : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">知识库</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse medical knowledge organized by 科目 and 系统.
        </p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {/* Left: Tree */}
        <Card className="w-72 shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <ListTree className="h-4 w-4" />
                目录
              </CardTitle>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索知识点..."
                className="pl-8 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              {mockTreeData.map((node) => (
                <TreeNodeItem
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Middle: Content */}
        <Card className="flex-1">
          {selectedNode ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-medical-500" />
                    <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-24rem)]">
                  <div className="prose-medical">
                    {selectedNode.content ? (
                      <>
                        <p>{selectedNode.content}</p>
                        <h2>要点</h2>
                        <ul>
                          <li>医学教育中的重要概念</li>
                          <li>常见考试主题</li>
                          <li>临床相关性：高</li>
                        </ul>
                        <h2>临床关联</h2>
                        <p>
                          理解这个主题对临床实践至关重要。
                          相关疾病包括...
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                        <p>选择一个主题 to view its content</p>
                        <p className="text-sm">内容即将上线</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <BookOpen className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">选择一个主题</p>
              <p className="text-sm">从左侧目录选择一个主题开始学习</p>
            </div>
          )}
        </Card>

        {/* Right: Quick nav */}
        <Card className="w-56 shrink-0 hidden xl:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">本页导航</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="space-y-0.5">
              {["概述", "要点", "临床关联", "相关主题", "参考文献"].map(
                (item) => (
                  <button
                    key={item}
                    className="w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


