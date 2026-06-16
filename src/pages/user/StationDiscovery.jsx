import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import StationCard from "../../components/station/StationCard.jsx";
import StationsMap from "../../components/StationsMap.jsx";
import { getStations } from "../../api/api";

const IMAGES = [
  "https://lh3.googleusercontent.com/aida/AP1WRLtxR50W7xzuq8Jgify1V6h5M7LS-XGVz_K6wJQEnMnklDKemtRVV0hKstvxfzEawLdOjPKPyiY7tfHAnFDQ-k-SF6x9tlpMeBWsDR4tfFHVKUMfH6y2kCSOpNoabidqvnamiLDWMfTx9jI7dG4_K1leyXQ9s-BCeZ4zwQq6UPjaje6C69PBypdZhOTX2Ml_zSxC6qVMJw0SPhLZpflAQVY9gOcJyETf3gKNe-uS7t9rAK31d9l-12UJ7Ks",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDO8EWFtKV8JyiyAw3oOqvtSqSAAJ9wZ5dcO5FPb4Fg09ZJY5z70NUCk8Y_ytNcbQuGoqSJkPWipBVlw41cbkXwKWr87SJavQEonQi_ik-PssBN1lnZBb4SJWE6cnT9q1j5qEtoEAu4K_9AItF2HjqPWtKeoAknXep1Yu1Z-ISx0tbvTT06f6VrDo_-10NIJJKYJuk0PprDc3jAv3TNYcTDP2xvB_px0c8Vwfbwq46wcMVNIs5ssixhul0nQqRb15eDoN2tpnPS1kk",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAIVMFlvoFGJN8I5xaZNJ73Pc8n3I4Px8T-fAnAzP_CfDFIJANApV6j0bGEkq-rDKWDdEt3QjFvN2V4qOqeHpIY7EE4-if43OKubqSAVfVw6HIf6M7f783wTPS88D__kpTJ5s-c6dgAtBquUMLje45MhdggeNefWmTCWtrSmXTzJx9BzyCdxGMwkya5R7XWpGawF0vcyVDT29wMXH8Q8rqjcBF2Rml8ZyUKa3YfO2VHXkZHjHHlxVvTWBzyxig7mew5FS5DKUEusSc",
];

const StationDiscovery = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStations()
      .then(setStations)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const onlineCount = stations.filter((s) => s.status === "online").length;

  return (
    <main className="main flex-col gap-lg">
      <div className="discovery-head">
        <h1 className="headline-lg">Available Stations</h1>
        <p className="body-lg text-secondary">
          Find and reserve high-speed chargers near you — {onlineCount} of {stations.length} online now.
        </p>
      </div>

      {!loading && stations.length > 0 && <StationsMap stations={stations} />}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading stations…</span>
          </Spinner>
        </div>
      ) : (
        <Row className="g-4">
          {stations.map((station, i) => (
            <Col key={station.id} xs={12} md={6} lg={4}>
              <StationCard
                station={station}
                image={station.image_url || IMAGES[i % IMAGES.length]}
                onSelect={(s) => navigate(`/stations/${s.id}`)}
              />
            </Col>
          ))}
          {stations.length === 0 && <p className="text-muted">No stations available. Start the API and seed the database.</p>}
        </Row>
      )}
    </main>
  );
};

export default StationDiscovery;
