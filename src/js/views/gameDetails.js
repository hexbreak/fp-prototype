import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Jumbotron, Card, Container, Row, Col, Nav, Tab, Sonnet, Button } from "react-bootstrap";
import { Context } from "../store/appContext";
import { GameCard } from "../component/gameCard";
import PropTypes from "prop-types";

export const GameDetails = props => {
	const { store, actions } = useContext(Context);
	let rating = [];
	const capitalize = s => {
		if (typeof s !== "string") return "";
		return s.charAt(0).toUpperCase() + s.slice(1);
	};
	useEffect(() => {
		const loadGame = () => {
			actions.loadDlcs(props.location.state);
			actions.loadOtherGames(props.location.state);
			actions.loadGame(props.location.state);
			actions.loadGameAchievements(props.location.state);
			actions.loadGameTrailers(props.location.state);
		};
		loadGame();
	}, [props.location.state]);
	useEffect(() => {
		if (store.game.id == props.location.state) {
			const genreId = store.game.genres.map((value, index) => {
				return value.id;
			});
			actions.loadSimilarGames(genreId);
			actions.loadAddedByPlayers(store.game.added_by_status);
		}
	}, [store.game]);
	if (!!store.game.rating) {
		for (let i = 0; i < Math.floor(store.game.rating); i++) {
			rating.push(<i className="fas fa-star" />);
		}
	}
	if (store.game.id == props.location.state) {
		return (
			<Container fluid>
				<Jumbotron className="text-dark">
					<Container>
						<div>
							<img
								src={
									store.game.background_image != null
										? store.game.background_image
										: "https://cdn.pixabay.com/photo/2020/12/14/15/48/light-bulb-5831252_960_720.jpg"
								}
								alt="First slide"
							/>
						</div>
						<h1>{store.game.name}</h1>
						<p>{store.game.description_raw}</p>
					</Container>
				</Jumbotron>
				<Tab.Container defaultActiveKey="details">
					<Nav variant="pills" style={{ height: "3rem" }} className="flex-column">
						<Row>
							<Nav.Item>
								<Nav.Link eventKey="details">
									<h1>Details</h1>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="statistics">
									<h1>Statistics</h1>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="store">
									<h1>Store</h1>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="media">
									<h1>Media</h1>
								</Nav.Link>
							</Nav.Item>
							{/* <Button onClick={() => actions.addtoFavorites()}>Add to Favorites</Button> */}
						</Row>
					</Nav>
					<br />
					<br />
					<Tab.Content>
						<Tab.Pane eventKey="details">
							<Row>
								<Col>
									<div>
										<h1>Platforms</h1>
										<h5>
											{store.game.platforms != null &&
												store.game.platforms.map((value, index) => {
													return ` ${value.platform.name}`;
												})}
										</h5>
									</div>
								</Col>
								<Col>
									<div>
										<h1>Genres</h1>
										<h5>
											{store.game.genres != null &&
												store.game.genres.map((value, index) => {
													return ` ${value.name}`;
												})}
										</h5>
									</div>
								</Col>
								<Col>
									<div>
										<h1>Release Date</h1>
										<h5>{store.game.released != null && store.game.released}</h5>
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<div>
										<h1>Developers</h1>
										<h5>
											{store.game.developers != null &&
												store.game.developers.map((value, index) => {
													return ` ${value.name}`;
												})}
										</h5>
									</div>
								</Col>
								<Col>
									<div>
										<h1>Publishers</h1>
										<h5>
											{Array.isArray(store.game.publishers) &&
												store.game.publishers.length > 0 &&
												store.game.publishers.map((value, index) => {
													return ` ${value.name}`;
												})}
										</h5>
									</div>
								</Col>
								<Col>
									<div>
										<h1>Age Ranting</h1>
										<h5>{store.game.esrb_rating != null && store.game.esrb_rating.name}</h5>
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<h1> Downloadable Content </h1>
									<div className="scroller">
										{store.dlcsList != null &&
											store.dlcsList.map((value, index) => {
												return <GameCard className="card" key={index} game={value} />;
											})}
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<h1> Game Series </h1>
									<div className="scroller">
										{store.otherGamesList != null &&
											store.otherGamesList.map((value, index) => {
												return <GameCard className="card" key={index} game={value} />;
											})}
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<h1>Website</h1>
									{store.game.reddit_url != "" && (
										<a href={store.game.reddit_url} target="_blank" rel="noreferrer">
											<i className="fab fa-reddit website" />
										</a>
									)}

									{store.game.website != "" && (
										<a target="_blank" rel="noreferrer" href={store.game.website}>
											<i className="fas fa-window-restore website" />
										</a>
									)}
								</Col>
								<Col>
									<h1>Tags</h1>
									{store.game.tags != null &&
										store.game.tags.map((value, index) => {
											return ` ${value.name}`;
										})}
								</Col>
							</Row>
							<Row>
								<h1>PC Requirements</h1>
							</Row>
							<Row>
								{store.game.platforms != null &&
									store.game.platforms.forEach(value => {
										if (value.platform.id == 4 && value.requirements != undefined) {
											if (
												Object.keys(value.requirements).length === 0 &&
												value.requirements.constructor === Object
											) {
												return null;
											} else {
												let requirements = Object.values(value.requirements);
												requirements.map((requirement, index) => {
													return (
														<div key={index} className="style">
															{requirement}
														</div>
													);
												});
											}
										} else {
											return null;
										}
									})}
							</Row>
							<Row>
								<h1>Similar Games</h1>
								<div className="scroller">
									{store.similarGamesList.map((value, index) => {
										return <GameCard className="card" key={index} game={value} />;
									})}
								</div>
							</Row>
						</Tab.Pane>
						<Tab.Pane eventKey="statistics">
							<Row>
								<Col>
									<h1>Rating</h1>
									<div
										className="style"
										style={{
											color: "red",
											fontSize: "4rem",
											width: "25rem",
											textAlign: "center"
										}}>
										{rating.map((value, index) => {
											return value;
										})}
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<h1>Metascore</h1>
									<h5>{store.game.metacritic != null && store.game.metacritic}</h5>
								</Col>
								<Col>
									<h1>Rating Count</h1>
									<h5>{store.game.ratings_count}</h5>
								</Col>
								<Col>
									<h1>Added on Players</h1>
									<h5>{store.game.added}</h5>
								</Col>
							</Row>
							<Row>
								<Col>
									<h1>Players Status</h1>
									<div className="style">
										{store.addedByPlayers.map((value, index) => {
											return (
												<div key={index}>
													<h5 style={{ marginLeft: "1rem" }}> {capitalize(value)}</h5>
												</div>
											);
										})}
									</div>
								</Col>
								<Col>
									<h1>People on Favorites</h1>
									{}
								</Col>
							</Row>
							<Row>
								<Col>
									<h1>Achivements</h1>
									{store.gameAchievements != null &&
										store.gameAchievements.map((value, index) => {
											return (
												<div key={index}>
													<br />
													<div
														className="style"
														style={{
															width: "50rem",
															textAlign: "center"
														}}>
														<h1>{value.name}</h1>
														<p>{value.description}</p>
														<img
															src={value.image}
															className="achivement"
															alt="achievement"
														/>
														<h6>%{value.percent}</h6>
													</div>
												</div>
											);
										})}
								</Col>
							</Row>
						</Tab.Pane>
						<Tab.Pane eventKey="store">
							<Row>
								<Col>
									<h1>Stores</h1>
									<div>
										{store.game.stores.map((value, index) => {
											if (value.store.id == 11 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://d3bzyjrsc4233l.cloudfront.net/company_office/epicgames_logo.png"
															alt="epic store"
														/>
													</a>
												);
											} else if (value.store.id == 3 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://cdn4.iconfinder.com/data/icons/liu-square-blac/60/playstation-square-social-media-128.png"
															alt="psn"
														/>
													</a>
												);
											} else if (value.store.id == 2 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/387_Xbox_logo-512.png"
															alt="xbox store"
														/>
													</a>
												);
											} else if (value.store.id == 4 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://i.pinimg.com/originals/8e/14/6e/8e146e9e28baeb9b59c6004ed7b1343b.png"
															alt="app store"
														/>
													</a>
												);
											} else if (value.store.id == 5 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://cdn.iconscout.com/icon/free/png-512/gog-galaxy-555193.png"
															alt="gog"
														/>
													</a>
												);
											} else if (value.store.id == 6 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://media.pocketgamer.com/artwork/na-hois/eshop-logo.png"
															alt="nintendo"
														/>
													</a>
												);
											} else if (value.store.id == 7 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://www.freepnglogos.com/uploads/xbox-one-png-23.png"
															alt="xbox 360"
														/>
													</a>
												);
											} else if (value.store.id == 8 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/152_Google_Play-512.png"
															alt="google play"
														/>
													</a>
												);
											} else if (value.store.id == 9 && value.store.url != "") {
												return (
													<a href={value.url} key={index} arget="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://img.icons8.com/windows/452/itch-io.png"
															alt="itch io"
														/>
													</a>
												);
											} else if (value.store.id == 1 && value.store.url != "") {
												return (
													<a href={value.url} key={index} target="_blank" rel="noreferrer">
														<img
															className="store"
															src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1024px-Steam_icon_logo.svg.png"
															alt="steam"
														/>
													</a>
												);
											}
										})}
									</div>
								</Col>
							</Row>
						</Tab.Pane>
						<Tab.Pane eventKey="media">
							<Row>
								<Col>
									<h1>Media</h1>
									{store.gameTrailers != null &&
										store.gameTrailers.map((value, index) => {
											return (
												<div key={index}>
													<h3>{value.name}</h3>
													<video width="400" poster={value.preview} controls>
														<source src={value.data.max} type="video/mp4" />
														Your browser does not support HTML video.
													</video>
												</div>
											);
										})}
									{store.game.clip != null && (
										<div>
											<h3>Gameplay</h3>
											<video width="400" controls>
												<source src={store.game.clip.clip} type="video/mp4" />
												Your browser does not support HTML video.
											</video>
										</div>
									)}
								</Col>
							</Row>
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</Container>
		);
	} else {
		return <h1>Loading...</h1>;
	}
};

GameDetails.propTypes = {
	location: PropTypes.object
};
