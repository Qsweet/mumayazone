ALTER TABLE blog_posts DROP COLUMN category_id;
ALTER TABLE blog_posts ADD COLUMN category_id TEXT;
ALTER TABLE blog_posts ADD CONSTRAINT fk_blog_posts_categories FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
