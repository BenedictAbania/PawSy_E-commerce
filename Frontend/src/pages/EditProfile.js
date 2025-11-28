import React from "react";
import "../styles/EditProfile.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const EditProfile = () => {
  const navigate = useNavigate();

  return (
    <section className="account-page py-5">
      <div className="container d-flex justify-content-center">
        <div className="edit-card">
          <h3 className="edit-title">Edit Your Profile</h3>

          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input
                  className="form-control form-control-custom"
                  placeholder="Md"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control form-control-custom"
                  placeholder="Rimel"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control form-control-custom"
                  placeholder="rimell1111@gmail.com"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input
                  className="form-control form-control-custom"
                  placeholder="Kingston, 5236, United State"
                />
              </div>
            </div>

            <div className="password-section mt-4">
              <label className="form-label">Password Changes</label>
              <input
                className="form-control form-control-custom mb-3"
                placeholder="Current Password"
                type="password"
              />
              <input
                className="form-control form-control-custom mb-3"
                placeholder="New Password"
                type="password"
              />
              <input
                className="form-control form-control-custom mb-3"
                placeholder="Confirm New Password"
                type="password"
              />
            </div>

            <div className="d-flex gap-3 justify-content-end align-items-center mt-4">
              <Link to="/account" className="btn btn-cancel">
                Cancel
              </Link>
              <Button
                className="btn btn-save"
                onClick={() => navigate("/account")}
              >
                Save Changes
              </Button>
              {/* <button type="submit" className="btn btn-save">
                Save Changes
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
