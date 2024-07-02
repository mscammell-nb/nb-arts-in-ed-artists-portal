import { useQueryForDataMutation } from "@/redux/api/quickbaseApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { Check, X } from "lucide-react";

const PerformersPage = () => {
  const artistRecordId = localStorage.getItem("artistRecordId");
  const [
    queryForData,
    {
      data: performersData,
      isLoading: isPerformersLoading,
      isSuccess: isPerformersSuccess,
      isError: isPerformersError,
      error: performersError,
    },
  ] = useQueryForDataMutation();

  useEffect(() => {
    queryForData({
      from: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
      select: [3, 7, 8, 9, 10, 11, 14],
      where: `{14.EX.${artistRecordId}}`,
    });
  }, [queryForData]);

  useEffect(() => {
    console.log("performersData: ", performersData);
  }, [performersData]);

  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[700px] max-w-3xl">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Performer List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">First Name</TableHead>
                    <TableHead className="text-center">Last Name</TableHead>
                    <TableHead className="text-center">Printed</TableHead>
                    <TableHead className="text-center">Cleared</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performersData &&
                    performersData.data.map((performer) => (
                      <TableRow key={performer[3].value}>
                        <TableCell className="text-center">
                          {performer[7].value}
                        </TableCell>
                        <TableCell className="text-center">
                          {performer[8].value}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {performer[9].value ? (
                              <Check size={18} strokeWidth={1.75} />
                            ) : (
                              <X size={18} strokeWidth={1.75} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="flex justify-center">
                          <div className="flex justify-center">
                            {performer[10].value ? (
                              <Check size={18} strokeWidth={1.75} />
                            ) : (
                              <X size={18} strokeWidth={1.75} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {performer[11].value ? (
                            <Badge variant="secondary" className="rounded-full">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-full">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PerformersPage;
