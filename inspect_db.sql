SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('categories', 'blog_posts') 
AND column_name IN ('id', 'category_id', 'slug');

SELECT count(*) as blog_count FROM blog_posts;
SELECT count(*) as cat_count FROM categories;
