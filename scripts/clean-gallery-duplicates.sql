-- Delete duplicate rows from gallery_items, keeping one instance for each unique image_url
DELETE FROM public.gallery_items
WHERE id IN (
    SELECT id
    FROM (
        SELECT
            id,
            image_url,
            ROW_NUMBER() OVER (PARTITION BY image_url ORDER BY id) as rn -- Keep the one with the lowest ID
        FROM public.gallery_items
    ) t
    WHERE t.rn > 1
);
