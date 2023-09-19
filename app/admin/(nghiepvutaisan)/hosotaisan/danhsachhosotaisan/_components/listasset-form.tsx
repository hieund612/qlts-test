"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { useEffect, useState, useReducer } from "react";
import { hoSoTaiSanServices } from "../services";
import { formReducer, INITIAL_STATE_FORM } from "@/lib/common";

export default function ListTaiSanForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = hoSoTaiSanServices.GetListTaiSan(id!);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch({ type: action });
  }, [action, id]); 
  return (
    <>
      <Modal show={show} size="lg" loading={loading}>
        <div>
          <Modal.Header onClose={onClose}>Danh sách mã tài sản đất</Modal.Header>
          <Modal.Body nameClass="grid-cols-12">
            <div className='col-span-12'>            
              {
                data && data.map((item: any, index: any) => (<span key={index}>{item?.soTheTaiSan + ";"}</span>))                
              }
            </div>
          </Modal.Body>
          <Modal.Footer onClose={onClose}>
            <></>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
