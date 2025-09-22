import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { IoLogoBitcoin } from "react-icons/io";
import { MdError } from "react-icons/md";

export const formatPrice = (price: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(Number(price));

export const formatQuantity = (quantity: string | number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(Number(quantity));

export const formatDate = (time: Date) => {
  const formattedDate = time.toDateString();
  const formattedHours = time.getHours();
  const formattedMinutes = time.getMinutes();
  const formattedSeconds = time.getSeconds();

  return `${formattedDate}, ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export function formatCoinName(baseAsset: string) {
  switch (baseAsset) {
    case "SOL":
      return "Solana";
    case "ETH":
      return "Ethereum";
    case "BTC":
      return "Bitcoin";
    default:
      return "INVALID COIN AND MARKET";
  }
}

export function formatCoinImg(baseAsset: string) {
  switch (baseAsset) {
    case "SOL":
      return "https://i.pinimg.com/736x/bd/f5/06/bdf5066589b7865a55d6790c210dba6d.jpg";
    case "ETH":
      return "https://icon2.cleanpng.com/20180809/rek/02e75b5d49e30f30c9b63227d7021e80.webp";
    case "BTC":
      return "https://png.pngtree.com/png-clipart/20210228/ourmid/pngtree-golden-bitcoin-coin-3d-rendering-png-image_2988648.jpg";
    default:
      return "INVALID COIN AND MARKET";
  }
}

export function formatCoinLogo(baseAsset: string) {
  switch (baseAsset) {
    case "SOL":
      return SiSolana;
    case "ETH":
      return FaEthereum;
    case "BTC":
      return IoLogoBitcoin;
    default:
      return MdError;
  }
}
