import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";

function CancelOrderDialog({
  userId,
  market,
  side,
  orderId,
  openCancelDialog,
  setOpenCancelDialog,
}: {
  userId: string;
  market: string;
  side: string;
  orderId: string;
  openCancelDialog: boolean;
  setOpenCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  async function cancelOrder() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/v1/order/cancelOrder`,
        {
          userId: userId,
          market: market,
          side: side,
          orderId: orderId,
        }
      );
      const data = res.data;
      toast.success(data.message);
      setOpenCancelDialog(false);
    } catch (error) {
      console.log("Error while cancelling order", error);
      toast.error("Error while cancelling order");
      setOpenCancelDialog(false);
    }
  }
  return (
    <Dialog open={openCancelDialog}>
      <DialogTrigger
        onClick={() => setOpenCancelDialog(true)}
        className="px-2 py-2 w-full rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600"
      >
        Cancel Order
      </DialogTrigger>
      <DialogContent className="bg-[#0d0d10]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently cancel your
            order
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => setOpenCancelDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={cancelOrder}
            className="px-7 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600"
            variant="outline"
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelOrderDialog;
