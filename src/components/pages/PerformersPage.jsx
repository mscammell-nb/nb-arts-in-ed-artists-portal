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
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Performer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Printed</TableHead>
                <TableHead>Cleared</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performersData &&
                performersData.data.map((performer) => (
                  <TableRow key={performer[3].value}>
                    <TableCell>{performer[7].value}</TableCell>
                    <TableCell>{performer[8].value}</TableCell>
                    <TableCell>
                      {performer[9].value ? (
                        <Check size={20} color="green" strokeWidth={1.5} />
                      ) : (
                        <X size={20} color="red" strokeWidth={1.5} />
                      )}
                    </TableCell>
                    <TableCell className="">
                      {performer[10].value ? (
                        <Check size={20} color="green" strokeWidth={1.5} />
                      ) : (
                        <X size={20} color="red" strokeWidth={1.5} />
                      )}
                    </TableCell>
                    <TableCell>
                      {performer[11].value ? (
                        <Badge className="rounded-full bg-green-600">Active</Badge>
                      ) : (
                        <Badge className="rounded-full bg-red-600">Inactive</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default PerformersPage;
