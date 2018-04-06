function newLinkSubscribe(parent, args, context, info) {
    return context.db.subscription.link(
        // https://github.com/graphcool/prisma/issues/1734
        // { where: { mutation_in: ['CREATED'] } },
        {},
        info
    );
}

const newLink = {
    subscribe: newLinkSubscribe
};

module.exports = {
    newLink
};
