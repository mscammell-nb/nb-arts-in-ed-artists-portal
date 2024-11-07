import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const DefinitionsDialog = ({ definitions }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link" type="button">
          Click here for definitions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Service Type Definitions</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {definitions.map((definition) => (
          <div>
            <h2 className="font-semibold">{definition.title}</h2>
            <p>{definition.content}</p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DefinitionsDialog;
