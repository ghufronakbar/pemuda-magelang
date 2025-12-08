import { FormCategoryHub } from "@/app/dashboard/(zhub)/(components)/(category)/form-category-zhub";
import {
  DataCategoryHub,
  TableZHubCategory,
} from "@/app/dashboard/(zhub)/(components)/(category)/table-zhub-category";
import { deleteCategoryHub, getAllHubs } from "@/actions/zhub";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  categories: DataCategoryHub[];
}

export const FormKategoriZhub = ({ categories }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori Zhub</CardTitle>
        <CardDescription>
          Kategori Zhub yang terdaftar di platform ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <FormCategoryHub />
        </div>
        <TableZHubCategory
          data={categories}
          onDelete={async (id) => {
            await deleteCategoryHub(id);
          }}
        />
      </CardContent>
    </Card>
  );
};
