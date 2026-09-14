import Link from 'next/link';
import { contentfulClient } from '../lib/contentful';

interface BlogPostFields {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

async function getBlogPosts() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-sky-50/60 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-16 text-center border-b border-sky-200 pb-8">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest text-sky-700 uppercase bg-sky-100 rounded-full">
            Curated Archive
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            🎬 Movie & Animation Blog
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            A minimalist collection of cinematic moments, memories, and meaning.
          </p>
        </header>
        
        <div className="flex flex-col gap-8">
          {posts.map((post: any) => {
            const fields = post.fields as BlogPostFields;
            const imageUrl = fields.thumbnail?.fields?.file?.url 
              ? `https:${fields.thumbnail.fields.file.url}`.replace('http:', 'https:') 
              : null;

            return (
              <Link key={post.sys.id} href={`/posts/${fields.slug}`} className="group block">
                <article className="flex flex-col md:flex-row bg-white border-2 border-sky-100 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-sky-300">
                  
                  {imageUrl ? (
                    <div className="relative md:w-5/12 aspect-video md:aspect-auto overflow-hidden bg-sky-50">
                      <img 
                        src={imageUrl} 
                        alt={fields.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="md:w-5/12 h-48 md:h-auto bg-sky-50 flex items-center justify-center text-sky-400 font-medium">
                      No image
                    </div>
                  )}
                  
                  <div className="md:w-7/12 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-mono text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">
                          {fields.slug}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight mb-3">
                        {fields.title}
                      </h2>
                      
                      <p className="text-slate-600 text-sm md:text-base line-clamp-2 leading-relaxed">
                        {fields.description || 'Explore the deep insights and details of this curated collection.'}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                      Read Article 
                      <span className="ml-1.5">→</span>
                    </div>
                  </div>

                </article>
              </Link>
            );
          })}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-sky-100 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-700">No posts found</h3>
              <p className="text-slate-500 mt-2">Please create posts in Contentful CMS first.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}