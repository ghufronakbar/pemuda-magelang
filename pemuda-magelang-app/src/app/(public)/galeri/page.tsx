import { getAllProducts } from "@/actions/product";
import { GalleryCardProps } from "@/components/gallery/gallery-card";
import { GallerySection } from "@/components/gallery/gallery-section";
import { ProductStatusEnum, TalentStatusEnum } from "@prisma/client";

const GaleriPage = async () => {
  const products = await getAllProducts();
  const mappedProducts: GalleryCardProps[] = products
    .filter(
      (product) =>
        product.talent.status === TalentStatusEnum.approved &&
        product.status === ProductStatusEnum.published
    )
    .map((product) => {
      return {
        name: product.title,
        image: product.images[0],
        author: {
          image: product.talent.profilePicture,
          name: product.talent.name,
          profession: product.talent.profession,
        },
        category: product.category,
        description: product.description,
        tags: product.tags,
        slug: product.slug,
        title: product.title,
      };
    });
  return (
    <GallerySection
      className="py-26"
      products={mappedProducts}
      limit={4}
    />
  );
};

export default GaleriPage;
