import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../firebase/config";

export interface Coupon {
  id: string;
  code: string;
  templateId: string;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
}

export const validateAndUseCoupon = async (code: string, templateId: string, userId: string): Promise<boolean> => {
  const q = query(
    collection(db, "coupons"), 
    where("code", "==", code),
    where("templateId", "==", templateId)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;

  const couponDoc = snapshot.docs[0];
  const couponData = couponDoc.data() as Coupon;

  if (couponData.usedCount >= couponData.maxUses) return false;
  if (couponData.usedBy.includes(userId)) return false;

  const couponRef = doc(db, "coupons", couponDoc.id);
  await updateDoc(couponRef, {
    usedCount: increment(1),
    usedBy: arrayUnion(userId)
  });

  return true;
};
