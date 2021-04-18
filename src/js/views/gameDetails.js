import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Jumbotron, OverlayTrigger, Container, Row, Col, Nav, Tab, Tooltip, Button } from "react-bootstrap";
import { Context } from "../store/appContext";
import { GameCard } from "../component/gameCard";
import PropTypes from "prop-types";

export const GameDetails = props => {
	const { store, actions } = useContext(Context);
	let rating = [];
	var gameRequirements = [];
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
			actions.getUserGames(store.id);
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
			actions.checkUserGames(store.game.id);
		}
	}, [store.game]);
	useEffect(() => {
		const checkUserGames = () => {
			actions.checkUserGames(store.game.id);
		};
		checkUserGames();
	}, [store.user_games]);
	if (store.game.id == props.location.state) {
		if (store.game.platforms != null) {
			let pc = store.game.platforms.filter(value => {
				return value.platform.id == 4 && value.requirements != undefined;
			});
			if (pc[0] != undefined) {
				if (Object.keys(pc[0].requirements).length === 0 && pc[0].requirements.constructor === Object) {
				} else {
					gameRequirements = Object.values(pc[0].requirements);
				}
			}
		}
		if (!!store.game.rating) {
			for (let i = 0; i < Math.floor(store.game.rating); i++) {
				rating.push(
					<img
						className="center"
						src="https://icons.iconarchive.com/icons/goodstuff-no-nonsense/free-space/1024/space-invader-icon.png"
						alt={i}
						style={{
							height: "5rem",
							width: "auto"
						}}
					/>
				);
			}
		}
		const renderUserGames = props => (
			<Tooltip id="button-tooltip" {...props}>
				{store.check.length > 0 ? "Delete from your games." : "Add to your games."}
			</Tooltip>
		);
		const renderNew = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to new games!
			</Tooltip>
		);
		const renderProgress = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to games on progress!
			</Tooltip>
		);
		const renderFinished = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to finished games!
			</Tooltip>
		);
		const renderCompleted = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to completed games!
			</Tooltip>
		);
		const renderFavorite = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to favorite games!
			</Tooltip>
		);
		const renderDropped = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to dropped games!
			</Tooltip>
		);
		const renderWishlist = props => (
			<Tooltip id="button-tooltip" {...props}>
				Add to games on your wishlist!
			</Tooltip>
		);
		return (
			<Container fluid>
				<Jumbotron className="text-dark" style={{ backgroundColor: "white" }}>
					<Container>
						<div>
							<img
								className="rounded details-image"
								src={
									store.game.background_image != null
										? store.game.background_image
										: "https://cdn.pixabay.com/photo/2020/12/14/15/48/light-bulb-5831252_960_720.jpg"
								}
								alt="First slide"
							/>
						</div>
						<h1 style={{ margin: "1.5rem 0 1.5rem 0" }}>{store.game.name}</h1>
						<p style={{ lineHeight: "1.8rem" }}>{store.game.description_raw}</p>
					</Container>
				</Jumbotron>
				<Container fluid className="white">
					<Tab.Container defaultActiveKey="details">
						<Nav variant="pills" style={{ height: "3rem" }} className="flex-column">
							<Row style={{ marginTop: "1rem" }}>
								<Nav.Item>
									<Nav.Link bg="light" variant="light" eventKey="details">
										<h4>Details</h4>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="statistics">
										<h4>Statistics</h4>
									</Nav.Link>
								</Nav.Item>
								{/* <Nav.Item>
								<Nav.Link eventKey="store">
									<h4>Store</h4>
								</Nav.Link>
							</Nav.Item> */}
								<Nav.Item>
									<Nav.Link eventKey="media">
										<h4>Media</h4>
									</Nav.Link>
								</Nav.Item>
								{store.id > 0 && (
									<div>
										{store.check.length > 0 ? (
											<OverlayTrigger
												placement="top"
												delay={{ show: 250, hide: 400 }}
												overlay={renderUserGames}>
												<Button
													variant="danger"
													onClick={() => actions.deleteFromUserGames(store.game.id)}>
													<i className="fas fa-trash center" />
												</Button>
											</OverlayTrigger>
										) : (
											<OverlayTrigger
												placement="top"
												delay={{ show: 250, hide: 400 }}
												overlay={renderUserGames}>
												<Button variant="danger" onClick={() => actions.addtoUserGames()}>
													<i className="fas fa-gamepad center" />
												</Button>
											</OverlayTrigger>
										)}
									</div>
								)}
							</Row>
						</Nav>
						{store.check.length > 0 && (
							<Row style={{ marginTop: "3rem" }}>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderNew}>
										{store.check[0].game_status == "new" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-star center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "new")}>
												<i className="far fa-star center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderProgress}>
										{store.check[0].game_status == "progress" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-wrench center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "progress")}>
												<i className="fas fa-screwdriver center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderFinished}>
										{store.check[0].game_status == "finished" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-check-square center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "finished")}>
												<i className="far fa-check-square center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderCompleted}>
										{store.check[0].game_status == "completed" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-trophy center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "completed")}>
												<i className="fas fa-medal center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderFavorite}>
										{store.check[0].game_status == "favorite" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-heart center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "favorite")}>
												<i className="far fa-heart center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderDropped}>
										{store.check[0].game_status == "dropped" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-thumbs-down center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "dropped")}>
												<i className="far fa-thumbs-down center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
								<Col>
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 400 }}
										overlay={renderWishlist}>
										{store.check[0].game_status == "wishlist" ? (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "all")}>
												<i className="fas fa-hand-holding-usd center" />
											</Button>
										) : (
											<Button
												id="toggletags"
												variant="secondary"
												onClick={e => actions.editUserGames(store.id, "wishlist")}>
												<i className="fas fa-dollar-sign center" />
											</Button>
										)}
									</OverlayTrigger>
								</Col>
							</Row>
						)}
						<Tab.Content className="space">
							<Tab.Pane eventKey="details">
								<Row className="center detailspace">
									<Col>
										<div>
											<h3>Platforms</h3>
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
											<h3>Genres</h3>
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
											<h3>Release Date</h3>
											<h5>{store.game.released != null && store.game.released}</h5>
										</div>
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<div>
											<h3>Developers</h3>
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
											<h3>Publishers</h3>
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
											<h3>Age Ranting</h3>
											<h5>{store.game.esrb_rating != null && store.game.esrb_rating.name}</h5>
										</div>
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3> Downloadable Content </h3>
										<Row id="detailsGameCardsRow">
											{store.dlcsList != null &&
												store.dlcsList.map((value, index) => {
													return (
														<GameCard
															id={"detailsCard"}
															className="card"
															key={index}
															game={value}
														/>
													);
												})}
										</Row>
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3> Game Series </h3>
										<Row id="detailsGameCardsRow">
											{store.otherGamesList != null &&
												store.otherGamesList.map((value, index) => {
													return (
														<GameCard
															id={"detailsCard"}
															className="card"
															key={index}
															game={value}
														/>
													);
												})}
										</Row>
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3>Website</h3>
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
										<h3>Tags</h3>
										{store.game.tags != null &&
											store.game.tags.map((value, index) => {
												return ` ${value.name}`;
											})}
									</Col>
								</Row>
								<Row className="center detailspace">
									<h3 className="center">PC Requirements</h3>
								</Row>
								<Row className="detailspace">
									{gameRequirements.length > 0 &&
										gameRequirements.map((value, index) => {
											return <Col key={index}>{value}</Col>;
										})}
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3>Similar Games</h3>
										<Row id="detailsGameCardsRow">
											{store.similarGamesList.map((value, index) => {
												return (
													<GameCard
														id={"detailsCard"}
														className="card"
														key={index}
														game={value}
													/>
												);
											})}
										</Row>
									</Col>
								</Row>
							</Tab.Pane>
							<Tab.Pane eventKey="statistics">
								<Row className="center detailspace">
									<Col>
										<h1>Rating</h1>
										<Row>
											{rating.map((value, index) => {
												return value;
											})}
										</Row>
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3>Metascore</h3>
										<div className="detailsbackground center detailsNumbers">
											<h5 className="detailsbox center detailsNumbers">
												{store.game.metacritic != null && store.game.metacritic}
											</h5>
										</div>
									</Col>
									<Col>
										<h3>Rating Count</h3>
										<div className="detailsbackground center detailsNumbers">
											<h5 className="detailsbox center detailsNumbers">
												{store.game.ratings_count}
											</h5>
										</div>
									</Col>
									<Col>
										<h3>Added on Players</h3>
										<div className="detailsbackground center detailsNumbers">
											<h5 className="detailsbox center detailsNumbers">{store.game.added}</h5>
										</div>
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3>Players Status</h3>
										<div
											className="detailsbox detailsborders center"
											style={{ height: "fit-content" }}>
											{store.addedByPlayers.map((value, index) => {
												return (
													<div key={index}>
														<h5> {capitalize(value)}</h5>
													</div>
												);
											})}
										</div>
									</Col>
									<Col>
										<h3>People with Game</h3>
										{}
									</Col>
								</Row>
								<Row className="center detailspace">
									<Col>
										<h3>Achievements</h3>
										{store.gameAchievements != null && (
											<Row style={{ maxWidth: "85rem" }} className="center">
												{store.gameAchievements.map((value, index) => {
													return (
														<div
															key={index}
															className="center detailsbox  detailsborders fit"
															style={{
																width: "40rem",
																textAlign: "center",
																height: "fit-content",
																margin: "1rem"
															}}>
															<h1>{value.name}</h1>
															<p>{value.description}</p>
															<img
																src={value.image}
																className="achivement"
																alt="achievement"
															/>
															<h6>{value.percent}%</h6>
														</div>
													);
												})}
											</Row>
										)}
									</Col>
								</Row>
							</Tab.Pane>
							{/* <Tab.Pane eventKey="store">
							<Row className="center detailspace">
								<Col>
									<h1>Stores</h1>
									<div className="detailspace">
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
						</Tab.Pane> */}
							<Tab.Pane eventKey="media">
								<Row className="center detailspace">
									<Col>
										<h1>Media</h1>
										<Row style={{ maxWidth: "100rem" }} className="center">
											{store.gameTrailers != null &&
												store.gameTrailers.map((value, index) => {
													return (
														<div
															className="center"
															style={{ marginTop: "3rem" }}
															key={index}>
															<h3>{value.name}</h3>
															<video width="500" poster={value.preview} controls>
																<source src={value.data.max} type="video/mp4" />
																Your browser does not support HTML video.
															</video>
														</div>
													);
												})}
										</Row>
										{store.game.clip != null && (
											<div className="center">
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
			</Container>
		);
	} else {
		return <h1>Loading...</h1>;
	}
};

GameDetails.propTypes = {
	location: PropTypes.object
};
