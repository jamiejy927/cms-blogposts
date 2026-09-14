import Link from 'next/link';
import { contentfulClient } from '../../../lib/contentful';

async function getBlogPostBySlug(slug: string) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    });
    return response.items[0] || null;
  } catch (error) {
    console.error('Error fetching blog post detail:', error);
    return null;
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return (
      <main className="min-h-screen p-6 max-w-3xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you are looking for does not exist.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition">
          ← Back to Home
        </Link>
      </main>
    );
  }

  const fields = post.fields as any;
  const imageUrl = fields.thumbnail?.fields?.file?.url 
    ? `https:${fields.thumbnail.fields.file.url}`.replace('http:', 'https:') 
    : null;

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto bg-white">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
          ← Back to Home
        </Link>
      </div>

      <article>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">{fields.title}</h1>

        {imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 mb-8 shadow-sm">
            <img 
              src={imageUrl} 
              alt={fields.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-gray max-w-none space-y-4">
          {fields.body?.content ? (
            fields.body.content.map((node: any, index: number) => {
              const parseNode = (item: any, keyIdx: number | string): React.ReactNode => {
                if (!item) return null;
                
                if (item.nodeType === 'text') {
                  const isBold = item.marks?.some((m: any) => m.type === 'bold');
                  if (isBold) {
                    return <strong key={keyIdx} className="font-bold text-gray-900">{item.value}</strong>;
                  }
                  return item.value;
                }

                if (item.content && Array.isArray(item.content)) {
                  return item.content.map((child: any, childIdx: number) => 
                    parseNode(child, `${keyIdx}-${childIdx}`)
                  );
                }

                return item.value || '';
              };

              return (
                <p key={index} className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {node.content ? node.content.map((subNode: any, subIdx: number) => parseNode(subNode, subIdx)) : null}
                </p>
              );
            })
          ) : (
            <p className="text-gray-700">No content available.</p>
          )}
        </div>
      </article>
    </main>
  );
}