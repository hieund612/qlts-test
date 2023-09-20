'use client'
import { useEffect, useState } from 'react';
import { AuthService } from '@/shared/services';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { DefaultMeta, DefaulPer } from '@/public/app-setting';
import { TanetSelect, TanetLabel, TanetInput } from '@/lib';
import { notificationServices } from './(tienich)/thongbao/services';
import InfiniteScroll from 'react-infinite-scroll-component';
import ThongBaoForm from './(tienich)/thongbao/_components/thongbao-form';
import ConfirmationDialog from '@/shared/components/confirm';
import Link from 'next/link';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Page() {
    const { getOauth } = AuthService();
    const router = useRouter();

    // pie chart

    const dataPie = {
        labels: ['Đất', 'Nhà'],
        datasets: [
            {
                data: [
                    105,
                    376
                ],
                backgroundColor: [
                    '#5b9bd5',
                    '#ed7d31'
                ],
            },
        ]
    };

    const optionsPie = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = '';
                        if (context.parsed) {
                            label = context.parsed + ' tài sản';
                        }
                        return label;
                    }
                }
            }
        }
    };

    // bar chart

    const labels = [
        'Hình thức khác',
        'Sử dụng nhà, đất để thanh toán',
        'Tạm giữ lại tiếp tục sử dụng',
        'Chuyển giao về địa phương để quản lý',
        'Chuyển mục đích sử dụng đất',
        'Bán tài sản trên đất, chuyển nhượng',
        'Điều chuyển',
        'Thu hồi',
        'Giữ lại tiếp tục sử dụng'
    ];

    const dataBar = {
        labels,
        datasets: [
            {
                data: [40, 25, 15, 20, 20, 12, 25, 20, 325],
                backgroundColor: '#00b0f0'
            }
        ],
    };

    const optionsBar = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
        },
    };

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        var auth = getOauth();

        if (auth) {
            setIsAdmin(auth.isAdministrator);
        }

        if (!auth) {
            router.push('/login');
        }

        getData(meta);
    }, []);

    const [meta, setMeta] = useState<any>({
        ...DefaultMeta,
    });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [show, setShow] = useState(false);
    const [id, setId] = useState(null);

    const onClose = async (isRefresh: boolean) => {
        setId(null);
        setShow(false);
    };

    const getData = async (meta: any) => {
        setLoading(true);

        meta.page_size = 7;
        let data = await notificationServices.GetData(meta);

        if (data && data.data) {
            meta.total = data.totalRows;
            if (meta.total == 0) {
                setHasMore(false);
            }
            setMeta(meta);
            setLoading(false);
            if (meta.page == 1) {
                setItems(data.data);
            }
            else {
                setItems(items.concat(data.data))
            }
        }
        else {
            setLoading(false);
        }
    }

    const fetchMoreData = () => {
        if (meta.page * meta.page_size > meta.total) {

            setHasMore(false);
        }
        else {
            meta.page = meta.page + 1;
            setMeta(meta);
            getData(meta);
        }
    }

    const onSearch = (values: any) => {
        meta.page = 1;
        meta.filter = values;
        setHasMore(true);
        setMeta(meta);
        getData(meta);
    };

    const onView = (item: any) => {
        if (item.loaiThongBao == 2) {
            setId(item.id);
            setShow(true);
        }
    }

    return (
        <>
            <div className='grid grid-cols-2 gap-4'>
                <div className='mt-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                    <div className='mb-4 flex text-base font-bold text-turquoise-400 uppercase'>
                        Tổng tài sản nhà, đất
                    </div>
                    <Formik
                        onSubmit={(values: any) => {
                            onSearch(values);
                        }}
                        initialValues={meta.filter}
                    >
                        {({ handleSubmit }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <div className={`gap-4 grid grid-cols-12`}>
                                    {
                                        isAdmin ?
                                            <>
                                                <div className='col-span-3 items-center'>
                                                    <TanetLabel
                                                        label='Chi nhánh, đơn vị:'
                                                    /></div>
                                                <div className='col-span-9'>
                                                    <TanetSelect
                                                        name='type'
                                                        id='type'
                                                        options={[{ value: 1, label: 'Chi nhánh Nam Từ Liêm' }, { value: 2, label: 'Chi nhánh Thanh Xuân' }]}
                                                        placeholder='Tên chi nhánh, đơn vị'
                                                    /></div>
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                    <div className='col-span-3 items-center'>
                                        <TanetLabel
                                            label='Năm:'
                                        /></div>
                                    <div className='col-span-5'>
                                        <TanetSelect
                                            name='type'
                                            id='type'
                                            options={[{ value: 1, label: '2022' }, { value: 2, label: '2023' }]}
                                            placeholder='Chọn năm'
                                        /></div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className='mt-3 flex font-bold justify-center text-gray-600'>
                        Tổng tài sản nhà, đất
                    </div>
                    <div className='mx-auto w-2/5'>
                        <Pie data={dataPie} options={optionsPie} />
                    </div>
                </div>
                <div className='mt-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                    <div className='mb-4 flex text-base font-bold text-turquoise-400 uppercase'>
                        Hình thức sắp xếp, xử lý nhà, đất đã phê duyệt
                    </div>
                    <Formik
                        onSubmit={(values: any) => {
                            onSearch(values);
                        }}
                        initialValues={meta.filter}
                    >
                        {({ handleSubmit }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <div className={`gap-4 grid grid-cols-12`}>
                                    {
                                        isAdmin ?
                                            <>
                                                <div className='col-span-3 items-center'>
                                                    <TanetLabel
                                                        label='Chi nhánh, đơn vị:'
                                                    /></div>
                                                <div className='col-span-9'>
                                                    <TanetSelect
                                                        name='type'
                                                        id='type'
                                                        options={[{ value: 1, label: 'Chi nhánh Nam Từ Liêm' }, { value: 2, label: 'Chi nhánh Thanh Xuân' }]}
                                                        placeholder='Tên chi nhánh, đơn vị'
                                                    /></div>
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                    <div className='col-span-3'>
                                        <TanetLabel
                                            label='Năm:'
                                        /></div>
                                    <div className='col-span-5'>
                                        <TanetSelect
                                            name='type'
                                            id='type'
                                            options={[{ value: 1, label: '2022' }, { value: 2, label: '2023' }]}
                                            placeholder='Chọn năm'
                                        /></div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className='mt-3 flex font-bold justify-center text-gray-600'>
                        Hình thức sắp xếp, xử lý nhà, đất đã phê duyệt
                    </div>
                    <div className='mx-auto'>
                        <Bar data={dataBar} options={optionsBar} />
                    </div>
                </div>
            </div>
            <div className='mt-3 mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                <div className='flow-root'>
                    <div className='mb-4 float-left flex text-base font-bold text-turquoise-400 uppercase'>
                        Thông báo
                    </div>
                    <div className='mb-4 float-right flex text-base text-turquoise-400 uppercase'>
                        <Link href='/admin/thongbao'>
                            Xem tất cả
                        </Link>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    height={'80vh'}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>{meta.total == 0 ? 'Không có thông báo nào' : 'Đã hiển thị hết tất cả thông báo'}</b>
                        </p>
                    }
                >
                    {items.map((i, index) => (
                        <div className='p-3' key={index}>
                            <a onClick={() => onView(i)} className='text-blue-900 text-xl no-underline hover:underline cursor-pointer'>{i?.tieuDe}</a>
                            <p className='text-base maxRow3'>{i?.noiDung}</p>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
            <ThongBaoForm show={show} onClose={onClose} action={'read'} id={id} />
            <ConfirmationDialog />
        </>
    );
}