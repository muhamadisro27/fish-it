import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import FishItTokenModule from "./FishItToken.js";

export default buildModule("FishItFaucetModule", (m) => {
  const { token } = m.useModule(FishItTokenModule);
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0));

  const faucet = m.contract("FishItFaucet", [token, initialOwner]);

  return { faucet, token };
});