'use client'

import {
  Newspaper,
  Filter,
  Clock,
  ExternalLink,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  category: string
  imageUrl?: string
  source: string
}

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Polygon Ecosystem Sees Massive Growth in DeFi Staking Protocols',
    description:
      'The Polygon network continues to attract developers and users with its low fees and high throughput, leading to a 200% increase in total value locked in staking protocols this quarter.',
    url: '#',
    publishedAt: '2025-09-04',
    category: 'Blockchain',
    source: 'DeFi Pulse',
    imageUrl: '/api/placeholder/300/200',
  },
  {
    id: '2',
    title:
      'Revolutionary Bee Conservation Program Powered by Blockchain Technology',
    description:
      'Scientists and environmentalists are leveraging blockchain technology to track and incentivize bee conservation efforts worldwide, showing promising results in population recovery.',
    url: '#',
    publishedAt: '2025-09-03',
    category: 'Bee News',
    source: 'Nature Today',
  },
  {
    id: '3',
    title: 'Institutional Adoption of Staking Reaches New Heights in 2025',
    description:
      'Major financial institutions are increasingly adopting cryptocurrency staking strategies, with total institutional staking assets surpassing $100 billion globally.',
    url: '#',
    publishedAt: '2025-09-02',
    category: 'Blockchain',
    source: 'Crypto Finance',
    imageUrl: '/api/placeholder/300/200',
  },
  {
    id: '4',
    title:
      'Urban Beekeeping Programs Show 40% Increase in City Bee Populations',
    description:
      'Cities worldwide are reporting significant success with urban beekeeping initiatives, contributing to both local ecosystems and food security.',
    url: '#',
    publishedAt: '2025-09-01',
    category: 'Bee News',
    source: 'Urban Ecology Review',
  },
  {
    id: '5',
    title: 'Web3 Integration Accelerates in Traditional Finance Sector',
    description:
      'Traditional financial institutions are rapidly adopting Web3 technologies for settlement, payments, and customer engagement, marking a significant shift in the industry.',
    url: '#',
    publishedAt: '2025-08-31',
    category: 'Blockchain',
    source: 'FinTech Weekly',
    imageUrl: '/api/placeholder/300/200',
  },
]

export function NewsModule() {
  const [filter, setFilter] = useState<string>('all')
  const [articles] = useState<NewsArticle[]>(mockNews)

  const filteredArticles =
    filter === 'all'
      ? articles
      : articles.filter((article) => article.category === filter)

  const categories = [
    'all',
    ...Array.from(new Set(articles.map((a) => a.category))),
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Blockchain':
        return 'from-purple-500/20 to-blue-500/20 border-purple-500/30'
      case 'Bee News':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
    }
  }

  const handleArticleClick = (url: string) => {
    if (!url || url === '#') {
      toast.error('This article page is not available yet 🚫')
      return
    }
    window.open(url, '_blank')
  }

  return (
    <div className="bg-card border border-dashed p-6 backdrop-blur-md max-md:p-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
          <Newspaper className="h-6 w-6" />
          Latest News
        </h2>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`flex items-center gap-1 px-3 py-1 text-sm transition-colors ${
              filter === category
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Filter className="h-3 w-3" />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* News Articles */}
      <div className="h-full space-y-4 overflow-y-auto">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => handleArticleClick(article.url)}
            className={`bg-gradient-to-r ${getCategoryColor(article.category)} group cursor-pointer border p-4 transition-all duration-200`}
          >
            <div className="flex gap-4">
              {article.imageUrl && (
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center bg-gray-600">
                    <Newspaper className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-purple-200">
                    {article.title}
                  </h3>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <p className="mb-3 line-clamp-2 text-xs text-gray-300">
                  {article.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded px-2 py-1 ${
                        article.category === 'Blockchain'
                          ? 'bg-purple-600/30 text-purple-200'
                          : article.category === 'Bee News'
                            ? 'bg-yellow-600/30 text-yellow-200'
                            : 'bg-gray-600/30 text-gray-200'
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="text-gray-400">{article.source}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3 w-3" />
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-center text-xs text-gray-400">
          Stay updated with the latest NECTR ecosystem and blockchain news
        </p>
      </div>
    </div>
  )
}
