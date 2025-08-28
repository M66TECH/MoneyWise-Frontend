const ContactSection = () => {
    return (
        <section id="contact" className="py-14 bg-background-surface">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl text-text-primary font-semibold sm:text-4xl">
                            Contactez-nous
                        </h2>
                        <p className="mt-3 text-text-secondary">
                            Une question, une suggestion ou un problème ? Nous sommes là pour vous aider.
                        </p>
                    </div>
                    <div className="mt-12">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-5"
                        >
                            <div>
                                <label className="font-medium text-text-primary">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-text-primary">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-text-primary">
                                    Message
                                </label>
                                <textarea required className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"></textarea>
                            </div>
                            <button
                                className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150"
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection;