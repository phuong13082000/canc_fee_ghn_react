import './App.css';
import {useState, useEffect} from "react";
import axios from "axios";

function App() {
    const token = 'ba8ec0ca-586b-11ed-b824-262f869eb1a7';
    const shopID = 3404895;

    const apiProvince = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
    const apiDistrict = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
    const apiWard = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
    const apiService = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services';
    const apiFee = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';

    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);
    const [listService, setListService] = useState([]);
    const [listFee, setListFee] = useState([]);

    const [inputs, setInputs] = useState([]);
    const [idService, setIdService] = useState([]);
    const [idWard, setIdWard] = useState([]);
    const [idDistrict, setIdDistrict] = useState([]);

    const getListProvince = () => {
        axios.get(
            apiProvince,
            {
                headers: {token: token}
            }
        ).then(function (response) {
            setListProvince(response.data.data);
        });
    }

    const getListDistrict = (idProvince) => {
        axios.get(
            apiDistrict,
            {
                headers: {token: token},
                params: {province_id: idProvince}
            }
        ).then(function (response) {
            setListDistrict(response.data.data);
        });
    }

    const getListWard = (idDistrict) => {
        axios.get(
            apiWard,
            {
                headers: {token: token},
                params: {district_id: idDistrict}
            }
        ).then(function (response) {
            setListWard(response.data.data);
        });
    }

    const getService = (toDistrict) => {
        axios.get(
            apiService,
            {
                headers: {token: token},
                params: {
                    shop_id: shopID,
                    from_district: 1442, //tphcm
                    to_district: toDistrict,
                }
            }
        ).then(function (response) {
            setListService(response.data.data);
        });
    }

    const getFee = (serviceID, toWardCode, toDistrict) => {
        axios.get(
            apiFee,
            {
                headers: {token: token},
                params: {
                    service_id: serviceID,
                    insurance_value: 1000000,
                    coupon: "",
                    to_ward_code: toWardCode,
                    to_district_id: toDistrict,
                    from_district_id: 1442, //tphcm
                    weight: 1000, //gram
                    length: 15, //cm
                    width: 15, //cm
                    height: 15, //cm
                }
            }
        ).then(function (response) {
            setListFee(response.data.data.total);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let idTPHCM = 1442;
        let districtID;
        let provinceID;

        setInputs(values => ({...values, [name]: value}));

        if (name === 'province' && value !== 0) {
            provinceID = value;

            getListDistrict(provinceID);
        } else if (name === 'district' && value !== 0) {
            districtID = value
            setIdDistrict(districtID);

            getListWard(districtID);
            getService(idTPHCM, districtID);
        } else if (name === 'ward' && value !== 0) {
            setIdWard(value);

        } else if (name === 'service' && value !== 0) {
            setIdService(value);

        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (idService && idWard && idDistrict) {
            getFee(idService, idWard, idDistrict);
        }
    }

    useEffect(() => {
        getListProvince();
    }, []);


    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="mt-3">
                    <select className="form-select form-select-lg mb-3" name="province" onChange={handleChange}>
                        <option defaultValue value="#">Thanh Pho</option>
                        {listProvince.map((item) => {
                            return (
                                <option key={item.ProvinceID} value={item.ProvinceID}>
                                    {item.ProvinceName}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="mt-3">
                    <select className="form-select form-select-lg mb-3" name="district" onChange={handleChange}>
                        <option defaultValue value="#">Huyen</option>
                        {listDistrict.map((item) => {
                            return (
                                <option key={item.DistrictID} value={item.DistrictID}>
                                    {item.DistrictName}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="mt-3">
                    <select className="form-select form-select-lg mb-3" name="ward" onChange={handleChange}>
                        <option defaultValue value="#">Xa</option>
                        {listWard.map((item) => {
                            return (
                                <option key={item.WardCode} value={item.WardCode}>
                                    {item.WardName}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="mt-3">
                    <select className="form-select form-select-lg mb-3" name="service" onChange={handleChange}>
                        <option defaultValue value="#">Dich vu</option>
                        {listService.map((item) => {
                            return (
                                <option key={item.service_id} value={item.service_id}>
                                    {item.short_name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-success">Submit</button>
                </div>
            </form>

            <p className="mt-3">Gia tri: 1000000 VND</p>
            <p className="mt-3">Phi ship: {listFee} VND</p>
            <p className="mt-3">Tong: {1000000+listFee} VND</p>
        </div>
    );
}

export default App;
