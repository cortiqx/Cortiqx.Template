import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

export interface TemplateData {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  isFree: boolean;
  images: string[];
  previewUrl?: string;
  githubUrl?: string;
  fileUrl?: string;
  createdBy: string;
  status: "pending" | "approved" | "rejected";
  downloads: number;
  createdAt: number;
}

export const uploadTemplateFiles = async (
  files: { images: File[]; zip?: File },
  pathPrefix: string
) => {
  const imageUrls: string[] = [];
  
  for (let i = 0; i < files.images.length; i++) {
    const file = files.images[i];
    const storageRef = ref(storage, `templates/${pathPrefix}/images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    imageUrls.push(url);
  }

  let fileUrl = "";
  if (files.zip) {
    const zipRef = ref(storage, `templates/${pathPrefix}/file/${files.zip.name}`);
    await uploadBytes(zipRef, files.zip);
    fileUrl = await getDownloadURL(zipRef);
  }

  return { imageUrls, fileUrl };
};

export const createTemplate = async (templateData: Omit<TemplateData, "status" | "downloads" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "templates"), {
    ...templateData,
    status: "pending",
    downloads: 0,
    createdAt: Date.now()
  });
  return docRef.id;
};

export const getApprovedTemplates = async () => {
  const q = query(
    collection(db, "templates"),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TemplateData[];
};

export const getAllTemplatesForAdmin = async () => {
  const q = query(collection(db, "templates"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TemplateData[];
};

export const getTemplateById = async (id: string) => {
  const docRef = doc(db, "templates", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as TemplateData;
  }
  return null;
};

export const updateTemplateStatus = async (id: string, status: "pending" | "approved" | "rejected") => {
  const docRef = doc(db, "templates", id);
  await updateDoc(docRef, { status });
};
