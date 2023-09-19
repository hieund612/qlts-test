import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetSelectTree } from "@/lib";
import { useEffect, useState } from "react";
import { notificationServices } from "@/app/admin/(tienich)/notification/services";
import { donViNoiBoServices } from "@/app/admin/donvinoibo/_services/services";
import { AuthService } from "@/shared/services";
import { MdChangeCircle } from "react-icons/md";

export default function ChangeDonVi() {
    const dataDefault = {
    };

    // Get đơn vị hiện tại

    const { getOauth } = AuthService();
    const [unitId, setUnitId] = useState(0);
    const donVi = donViNoiBoServices.GetById(unitId);
    const { data: dataDonViNoiBos } = notificationServices.GetDonVi(1);
    const [changeDonVi, setChangeDonVi] = useState(false);
    const [loading, setLoading] = useState(false);

    // Thay đổi đơn vị

    const showChangeDonVi = async () => {
        setLoading(true);

        setChangeDonVi(true);

        setLoading(false);
    }

    const { changeUnit } = AuthService();

    const onSubmit = async (values: any) => {
        setLoading(true);

        if (unitId) {
            var check = await changeUnit(values);
            if (check) {
                toast.success("Thay đổi đơn vị thành công!");
                setChangeDonVi(false);
                window.location.reload();
            } else {
                toast.error("Thay đổi đơn vị không thành công!");
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        var auth = getOauth();
        if (auth) {
            setUnitId(auth.unitId);
        }

    }, []);

    return (
        <>
            <button className="p-1" onClick={() => showChangeDonVi()}>
                <li className="flex items-center gap-x-2 cursor-pointer p-1 rounded-md text-[#ffc62f]">
                    <span className="text-sm font-medium flex-1 ml-2 dv-text" title={donVi?.data?.tenDV}>
                        <p className="long-text">
                            {donVi?.data?.tenDV}
                        </p>
                    </span>
                    <span className="text-xl block float-left tooltip" title="Thay đổi đơn vị">
                        <MdChangeCircle />
                    </span>
                </li>
            </button>
            <Modal show={changeDonVi} loading={loading} size="lg">
                <>
                    <Formik
                        onSubmit={(values) => {
                            onSubmit(values);
                        }}
                        initialValues={donVi.data ? donVi.data : dataDefault}
                        enableReinitialize={true}
                    >
                        {({ handleSubmit }) => (
                            <Form noValidate
                                onSubmit={handleSubmit}
                                onKeyPress={(ev) => {
                                    ev.stopPropagation();
                                }}>
                                <Modal.Header onClose={() => setChangeDonVi(false)}>Thay đổi đơn vị</Modal.Header>
                                <div className="p-5">
                                    <TanetSelectTree
                                        name="tenDV"
                                        id='tenDV'
                                        data={dataDonViNoiBos}
                                    />
                                </div>
                                <Modal.Footer onClose={() => setChangeDonVi(false)}>
                                    <>
                                        <button
                                            data-modal-hide="large-modal"
                                            type="submit"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Thay đổi đơn vị
                                        </button>
                                    </>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </>
            </Modal >
        </>
    );
}
