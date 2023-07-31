import "./Payment.scss";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useContext } from "react";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const Success = () => {
  const { t } = useTranslation();

  const { key, product } = useParams();

  const auth = useContext(AuthContext);
  const { request } = useHttp();

  const fetchAccount = useCallback(async () => {
    try {
      if (key && product && key.length === 100) {
        await request("/api/payment", "GET", null, {
          Authorization: `Bearer ${auth.accessToken}`,
        }).then(async (res) => {
          const payments = res.data.payments;
          const paymentsAttempts = res.data.paymentsAttempts;
          if (
            !payments.filter((item) => item.key === key).length > 0 &&
            paymentsAttempts.filter((item) => item.key === key).length > 0
          ) {
            const res = await request(
              "/api/user/update/profile-model",
              "PUT",
              { key: key, product: product },
              {
                Authorization: `Bearer ${auth.accessToken}`,
              }
            );
            auth.setUser(res.data);
          }
          if (
            !(paymentsAttempts.filter((item) => item.key === key).length > 0)
          ) {
            window.location.pathname = "/main";
          }
        });
      } else {
        window.location.pathname = "/main";
      }
    } catch (e) {}
  }, [auth, key, product, request]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return (
    <div className="body-payment">
      <div className="card">
        <div className="card-content">
          <div
            style={{
              borderRadius: "200px",
              height: "200px",
              width: "200px",
              background: "#F8FAF5",
              margin: "0 auto",
            }}
          >
            <i className="checkmark i-success">✓</i>
          </div>
          <h1 className="h1-success">{t("Success")}</h1>
          <p className="p-success">
            {t("Your purchase request has been processed")}.
            <br /> {t("Contact us if something went wrong")}.
          </p>
          <br />
          <Link to="/main">{t("Back")}</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
