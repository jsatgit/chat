import React from "react";
import { Header as SemanticHeader } from "semantic-ui-react";
import styled from "styled-components";

import { withContext, RoomContext } from "./context";

const Container = styled.div`
    margin-left: 20px;
    margin-right: 20px;
    height: 100%;
    display: flex;
    align-items: center;
`;

class Header extends React.PureComponent {
    render() {
        const { currentRoom } = this.props;
        return (
            <Container>
                <SemanticHeader as="h1">
                    {currentRoom && currentRoom.name}
                </SemanticHeader>
            </Container>
        );
    }
}

export default withContext(RoomContext, Header);
